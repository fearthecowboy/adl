import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Label } from './Label';
import { Preamble } from './Preamble';
import { TypeExpression } from './typeExpression';


export class TemplateDeclaration extends Element {
  kind = Kind.TemplateDeclaration;

  static parse(cursor: TokenCursor) {
    // <[trivia]Identifier[trivia]>
    // <[trivia][Identifier][trivia],[trivia]Identifier[trivia]>
    const template = new TemplateDeclaration();
    template.push(cursor.expecting(Kind.OpenAngle));                  // <
    do {
      template.push(Preamble.parse(cursor, true));                            // trivia
      template.push(Label.parse(cursor));                        // identifier
      template.push(Preamble.parse(cursor, true));                            // trivia
      if (cursor.is(Kind.Comma)) {
        template.push(cursor.expecting(Kind.Comma));
        continue;
      }
      break;
      // eslint-disable-next-line no-constant-condition
    } while (true);                                                 // comma means keep parsing parameters
    template.push(Preamble.parse(cursor, true));                              // trivia
    template.push(cursor.expecting(Kind.CloseAngle));                 // >
    return template;
  }
}


export class TemplateParameters extends Element {
  kind = Kind.TemplateParameters;

  static parse(cursor: TokenCursor) {
    // <[trivia]Identifier[trivia]>
    // <[trivia][Identifier][trivia],[trivia]Identifier[trivia]>
    const template = new TemplateParameters();
    template.push(cursor.expecting(Kind.OpenAngle));                  // <
    do {
      template.push(Preamble.parse(cursor, true));                            // trivia
      template.push(TypeExpression.parseTypeExpression(cursor));                        // type exp
      template.push(Preamble.parse(cursor, true));                            // trivia
      if (cursor.is(Kind.Comma)) {
        template.push(cursor.expecting(Kind.Comma));
        continue;
      }
      break;
      // eslint-disable-next-line no-constant-condition
    } while (true);                                                 // comma means keep parsing parameters
    template.push(Preamble.parse(cursor, true));                              // trivia
    template.push(cursor.expecting(Kind.CloseAngle));                 // >
    return template;
  }
}
