/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { isTerminator } from '../compiler/tokens';
import { Declaration } from './Declaration';
import { InheritanceDeclaration } from './InheritanceDeclaration';
import { Label } from './Label';
import { Preamble, Trivia } from './Preamble';
import { Property } from './Property';
import { TemplateDeclaration } from './TemplateDeclaration';
import { Terminator } from './Terminator';
import { TypeReference } from './TypeReference';

/**
 * [PREAMBLE] model NAME<PARAMS> : PARENTS { PARAMETERS };
 */
export class Model extends Declaration {
  readonly kind = Kind.Model;
  createProperty(name: string, type: TypeReference) {
    // add a new property after the last property.
    // need the indentation
    // this.findLast(Kind.Property).add()

  }

  get Properties() {
    return this.tokens.where(each => each.kind === Kind.Property);
  }

  get name(): string {
    return (this.find(Kind.Label).element as Label).name;
  }

  set name(name: string) {
    (this.find(Kind.Label).element as Label).name = name;
  }

  get isTemplate() {
    return !this.find(Kind.TemplateDeclaration).isInvalid;
  }

  get templateDeclaration(): TemplateDeclaration | undefined {
    return this.find(Kind.TemplateDeclaration).element;
  }

  static parse(cursor: TokenCursor, preamble: Preamble) {
    const model = new Model();
    model.push(preamble);
    model.push(cursor.expecting(Kind.ModelKeyword));                  // 'model' keywork
    model.push(Trivia.parse(cursor));                                 // trivia
    model.push(Label.parse(cursor));                             // name
    model.push(Trivia.parse(cursor));                                 // trivia

    if (cursor.is(Kind.OpenAngle)) {
      model.push(TemplateDeclaration.parse(cursor));         // < template >
      model.push(Trivia.parse(cursor));                               // trivia
    }

    if (cursor.is(Kind.Colon)) {
      model.push(cursor.expecting(Kind.Colon));
      model.push(InheritanceDeclaration.parse(cursor));
      model.push(Trivia.parse(cursor));                               // trivia
      // can now either extend
      if (isTerminator(cursor.kind)) {
        // no body
        model.push(Terminator.parse(cursor));
        return model;
      }
    }

    model.push(cursor.expecting(Kind.OpenBrace));
    model.push(Property.parseProperties(cursor));
    model.push(cursor.expecting(Kind.CloseBrace));
    return model;
  }

}
