import { Kind } from '../compiler/scanner';
import { isElement } from '../compiler/tokens';
import { ParameterAlias, TypeAlias } from './Alias';
import { Container } from './Container';
import { Element } from './Element';
import { Enum } from './Enum';
import { Interface } from './Interface';
import { Model } from './Model';
import { ResponseExpression } from './ResponseExpression';
import { RawToken } from './Token';

export class SourceFile extends Container {
  text = '';
  end = 0;

  name = '';

  /** Gets the enum declarations in the file  */
  get enums(): Array<Enum> {
    return <Array<Enum>>this.tokens.filter(each => each.kind === Kind.Enum);
  }

  /** gets all the interfaces in the file */
  get interfaces(): Array<Interface> {
    return <Array<Interface>>this.tokens.filter(each => each.kind === Kind.Interface);
  }

  /** gets all the model declarations in the file */
  get models(): Array<Model> {
    return <Array<Model>>this.tokens.filter(each => each.kind === Kind.Model);
  }

  /** gets all the response declarations in the file */
  getResponses(): Array<ResponseExpression> {
    return <Array<ResponseExpression>>this.tokens.filter(each => each.kind === Kind.ResponseExpression);
  }

  /** gets all the type alias declarations in the file */
  get typeAliases(): Array<TypeAlias> {
    return <Array<TypeAlias>>this.tokens.filter(each => each.kind === Kind.TypeAlias);
  }

  /** gets all the paramters alias declarations in the file */
  get parameterAliases(): Array<ParameterAlias> {
    return <Array<ParameterAlias>>this.tokens.filter(each => each.kind === Kind.ParameterAlias);
  }

  createModel(name: string): Model {
    throw new Error('Not Implemented');
  }

  createEnum(name: string): Enum {
    throw new Error('Not Implemented');
  }

  createInterface(name: string): Interface {
    throw new Error('Not Implemented');
  }

  createTypeAlias(name: string): TypeAlias {
    throw new Error('Not Implemented');
  }

  reset() {
    this.tokens.length = 0;
  }

  push(statement: RawToken | Element) {
    this.tokens.push(this.adopt(statement));
  }

  save(autofix = false) {
    // saving takes the text of the elements and persists it back to a whole doc.
    // this requires each element (and children) to properly render back to text
    // via the .text property
    for (const each of this.tokens) {
      if (isElement(each)) {
        each.save(autofix);
      }
    }

    return this.text = this.tokens.map(each => each.text).join('');
  }

}