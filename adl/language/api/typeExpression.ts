import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Label } from './Label';
import { LiteralValue } from './LiteralValue';
import { Preamble, Trivia } from './Preamble';
import { Property } from './Property';
import { TemplateParameters } from './TemplateDeclaration';
import { Token } from './Token';

/** a valid type expression (ie *use* ofa type. can be a model name, a builtin type, a literal type, or a object definition. ) */
export class TypeExpression extends Element {
  kind = Kind.TypeExpression;

  static parseTypeExpression(cursor: TokenCursor): TypeExpression {
    let trivia = Trivia.parse(cursor);
    let union: UnionTypeExpression | undefined;
    let retVal: TypeExpression | undefined;

    do {
      switch (cursor.kind) {
        case Kind.OpenBrace:
          retVal = InlineModelTypeEx.parse(cursor, trivia);
          break;

        case Kind.Identifier:
          retVal = ReferencedTypeEx.parse(cursor, trivia);
          break;

        case Kind.StringLiteral:
        case Kind.NumericLiteral:
        case Kind.TrueKeyword:
        case Kind.FalseKeyword:
          retVal = LiteralTypeExpression.parse(cursor, trivia);
          break;

        default:
          cursor.err('expecting type expression, did not match token for that.');
      }

      trivia = Trivia.parse(cursor);
      if (cursor.is(Kind.Bar)) {
        union = union || new UnionTypeExpression();
        union.push(retVal);
        union.push(trivia);
        union.push(cursor.expecting(Kind.Bar));
        trivia = Trivia.parse(cursor);
        continue;
      }

      if (union) {
        union.push(retVal);
        union.push(trivia);
        return union;
      }
      retVal.push(trivia);
      return retVal;
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }
}

export class ReferencedTypeEx extends TypeExpression {

  static parse(cursor: TokenCursor, trivia: Preamble | Array<Token>) {
    const typeExpression = new ReferencedTypeEx();
    typeExpression.push(trivia);
    // the name of a model
    typeExpression.push(Label.parse(cursor, true));
    if (cursor.is(Kind.OpenAngle)) {
      // foo<T>
      typeExpression.push(TemplateParameters.parse(cursor));
    }
    return typeExpression;
  }
}

export class InlineModelTypeEx extends TypeExpression {
  static parse(cursor: TokenCursor, trivia: Preamble | Array<Token>) {
    const typeExpression = new InlineModelTypeEx();
    typeExpression.push(trivia);

    typeExpression.push(cursor.expecting(Kind.OpenBrace));
    typeExpression.push(Property.parseProperties(cursor));
    typeExpression.push(cursor.expecting(Kind.CloseBrace));

    return typeExpression;
  }
}

export class LiteralTypeExpression extends TypeExpression {

  static parse(cursor: TokenCursor, trivia: Preamble | Array<Token>) {
    const literal = new LiteralTypeExpression();
    literal.push(trivia);
    literal.push(LiteralValue.parse(cursor));
    return literal;
  }
}

export class UnionTypeExpression extends TypeExpression {

}