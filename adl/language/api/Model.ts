/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { isTerminator } from '../compiler/tokens';
import { Declaration } from './Declaration';
import { from } from './ElementCursor';
import { InheritanceDeclaration } from './InheritanceDeclaration';
import { Label } from './Label';
import { Preamble } from './Preamble';
import { Property } from './Property';
import { TemplateDeclaration } from './TemplateDeclaration';
import { Terminator } from './Terminator';
import { TypeExpression } from './typeExpression';

/**
 * [PREAMBLE] model NAME<PARAMS> : PARENTS { PARAMETERS };
 */
export class Model extends Declaration {
  readonly kind = Kind.Model;
  createProperty(name: string, type: TypeExpression) {
    // add a new property after the last property.
    const newProp = new Property(new Label(name), ':', ' ', type, ';');
    let lastProperty = from(this).find(Kind.Property);
    let indentation: Preamble;

    if (lastProperty.isInvalid) {
      lastProperty = from(this).find(Kind.OpenBrace);
      indentation = new Preamble('\n  '); // two spaces?
    } else {
      indentation = new Preamble((lastProperty.token as Property).indentation);
      lastProperty.add(indentation, newProp);
    }
  }

  get Properties() {
    return <Array<Property>>from(this).selectAll(Kind.Property);
  }

  get name(): string {
    return (from(this).find(Kind.Label).token as Label).name;
  }

  set name(name: string) {
    (from(this).find(Kind.Label).token as Label).name = name;
  }

  get isTemplate() {
    return !from(this).find(Kind.TemplateDeclaration).isInvalid;
  }

  get templateDeclaration(): TemplateDeclaration | undefined {
    return from(this).find(Kind.TemplateDeclaration).token as TemplateDeclaration;
  }

  static parse(cursor: TokenCursor, preamble: Preamble) {
    const model = new Model();
    model.push(preamble);
    model.push(cursor.expecting(Kind.ModelKeyword));                  // 'model' keyword
    model.push(Preamble.parse(cursor, true));                                 // trivia
    model.push(Label.parse(cursor));                             // name
    model.push(Preamble.parse(cursor, true));                                 // trivia

    if (cursor.is(Kind.OpenAngle)) {
      model.push(TemplateDeclaration.parse(cursor));         // < template >
      model.push(Preamble.parse(cursor, true));                               // trivia
    }

    if (cursor.is(Kind.Colon)) {
      model.push(cursor.expecting(Kind.Colon));
      model.push(InheritanceDeclaration.parse(cursor));
      model.push(Preamble.parse(cursor, true));                               // trivia
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
