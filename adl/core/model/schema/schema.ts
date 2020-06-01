import { anonymous, isAnonymous } from '@azure-tools/sourcemap';
import { Node } from 'ts-morph';
import { getFirstDoc, getTagValue, setTag } from '../../support/doc-tag';
import { IsTypeDeclaration, TypeDeclaration } from '../../support/typescript';
import { Element, TSElement } from '../element';
import { Identity } from '../types';


export class Schema extends Element {
  /** 
   * name of this schema - may be an alias or an actual string name 
   */
  name: Identity;

  /**
   * short description of the schema
   */
  summary?: string;

  /**
   * extended description of the schema
   * CommonMark syntax MAY be used for rich text representation.
   */
  description?: string;

  /**
   * if null can be substituted for a value for this schema.
   * 
   * @todo: I'm not fond of having this in schema -- we should strongly consider refactoring this so the consumer gets it (ie, the property)
   */
  nullable?:  boolean;
  /**
   * 
   * @param type the schema 'type' that this schema represents. 
   * @param initializer optional object initializer
   */
  constructor(public type: string, initializer?: Partial<Schema>) {
    super();
    this.name = anonymous(type);
    this.initialize(initializer);
  }

  /** 
   * Indicates that this schema is not indended to be written to a file, and should be used inline.
   */
  get isInline() {
    return false;
  }

  /**
   * gets the literal type definition for this schema, as the consumer would be using.
   * 
   * ie, so primitive types return thigs like 'string', 'int32', 'datetime' etc 
   * object types will return their type unless they are 'inline' at which point they should
   * return the defintion as it would be used. 
   */
  get typeDefinition(): string {
    return `unknown /*= (not tsschema -- ${Object.getPrototypeOf(this).name}${this.name}/${(<any>this).kind} ) =*/`;
  }

  /**
   * returns the type declarations (references to the actual type declaration) for types that
   * are being used. 
   */
  get requiredTypeDeclarations(): Array<TypeDeclaration> {
    return [];
  }
}

export class NamedElement<TNode extends Node> extends TSElement<TNode> {
  get name(): Identity {
    let result: Identity | undefined = undefined;
    if (Node.isNamedNode(this.node) || Node.isNameableNode(this.node)) {
      result = this.node.getName();
    }
    return result ?? anonymous(this.node.getKindName());
  }

  set name(value: Identity) {
    if (isAnonymous(value)) {
      throw new Error('Cannot rename this node to anonymous.');
    }
    if (!Node.isRenameableNode(this.node)) {
      throw new Error('This node cannot be renamed.');
    }
    this.node.rename(value);
  }

  get summary() {
    return getFirstDoc(this.node).getDescription();
  }
  set summary(value: string | undefined) {
    getFirstDoc(this.node).setDescription(value||'\n');
  }

  get description() {
    return getTagValue(this.node, 'description');
  }
  set description(value: string | undefined) {
    setTag(this.node,'description', value);
  }
}

export class TSSchema<TNode extends Node> extends NamedElement<TNode> implements Schema {
  nullable?: boolean;

  constructor(public type: string, node: TNode, initializer?: Partial<Schema>) {
    super(node);
    this.initialize(initializer);
  }

  /**
   * returns the types that the schema needs 
   * 
   * this should be overridden in children that need to return something 
   * other than just themselves (ie, in Array)
   */
  get requiredTypeDeclarations(): Array<TypeDeclaration> {
    return this.isInline && IsTypeDeclaration( this.node ) ?  [this.node] : [];
  }
  
  get isInline(): boolean {
    return this.project.isFileAnonymous( this.node.getSourceFile() );
  }

  get typeDefinition(): string {
    if( this.isInline) {
      const v = this.node.getText();
      return v.substring( v.indexOf('{') );
    } 
    return <string>this.name;
  }
}
