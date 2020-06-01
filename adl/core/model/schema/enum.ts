import { isAnonymous } from '@azure-tools/sourcemap';
import { EnumDeclaration, EnumMember } from 'ts-morph';
import { literal, normalizeIdentifier } from '../../support/codegen';
import { appendTag, getFirstDoc, hasTag, setTag } from '../../support/doc-tag';
import { ApiModel } from '../api-model';
import { TSElement } from '../element';
import { Collection, CollectionImpl, Identity } from '../types';
import { Schema, TSSchema } from './schema';

export interface Enum extends Schema {
  extensible?: boolean;
  readonly values: Collection<EnumValue>;
}

export interface EnumValue {
  name?: string;
  description?: string;
  value: any;
}

class EnumValueImpl extends TSElement<EnumMember> implements EnumValue {
  constructor(node: EnumMember) {
    super(node);
  }

  get value(): any {
    return this.node.getValue();
  }

  get name(): string | undefined {
    return this.node.getName();
  }

  get description(): string | undefined {
    return getFirstDoc(this.node).getDescription();
  }
  set description(value: string | undefined) {
    getFirstDoc(this.node).setDescription(value || '\n');
  }
}

class EnumImpl extends TSSchema<EnumDeclaration> implements Enum {
  get extensible() {
    return hasTag(this.node, 'extensible');
  }
  set extensible(value: boolean) {
    if( value) {
      setTag(this.node, 'extensible', '');
    } 
  }

  /* get isInline() {
    // can be inlined at use case as union of literal types if all we have are
    // values and no names or descriptions.
    return this.anonymous && !this.description && !this.summary &&
      !linq.values(this.values.get()).any(
        v => !!v.description || v.name != normalizeIdentifier(v.value.toString()));
  }*/

  readonly values: Collection<EnumValue>;

  private addValue(value: EnumValue) {
    const name = value.name ?? value.value.toString();
    let val = value.value;
    
    if (typeof val !== 'string' && typeof val !== 'number') {
      // TODO: how would we represent enum of non-string, non-number?
      val = `/* ${typeof val} */${val}`;
    }
    
    const member = this.node.addMember({
      name: normalizeIdentifier(name),
      value: val
    });
    const result = new EnumValueImpl(member);
    result.description = value.description;
    
    return result;
  }

  private removeValue(value: EnumValue) {
    const name = value.name ?? value.value.toString();
    this.node.getMember(name)?.remove();
  }

  private getValues(): Array<EnumValue> {
    return this.node.getMembers().map<EnumValue>(each => new EnumValueImpl(each));
  }
  
  get typeDefinition() {
    if (this.isInline) {
      return this.values.get().map(v => literal(v.value)).join(' | ');
    }

    return <string>this.name;
  }

  constructor(node: EnumDeclaration, private anonymous: boolean) {
    super('enum', node);
    this.values = new CollectionImpl(this, this.addValue, this.removeValue, this.getValues);
  }
}

export function createEnum(api: ApiModel, identity: Identity, values: Array<EnumValue>, initializer?: Partial<Enum>) {
  const { name, file } = api.getNameAndFile(identity, 'enum');

  if (!isAnonymous(identity)) {
    const existing = api.getEnum(name);
    if (existing) {
      // TODO: This should be made reusable, determine that the definitions are fully the same, then emit nothing.
      appendTag(existing, 'todo', 'temporary-reuse-marker');
      return new EnumImpl(existing, false);
    }
  }

  const summary = initializer?.summary;
  const description = initializer?.description;
  const type = file.addEnum({
    name,
    isExported: true
  });

  const result = new EnumImpl(type, isAnonymous(identity));
  for (const each of values) {
    result.values.push(each);
  }

  result.initialize(initializer);
 
  return result;
}