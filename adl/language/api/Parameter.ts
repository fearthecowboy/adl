import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Label } from './Label';
import { Preamble, Trivia } from './Preamble';
import { Token } from './Token';
import { TypeExpression } from './typeExpression';


export class Parameter extends Element {
  readonly kind = Kind.Parameter;

  static parse(cursor: TokenCursor, preamble: Preamble) {
    const value = new Parameter();
    value.push(preamble);
    value.push(Label.parse(cursor, false));
    value.push(Trivia.parse(cursor));

    value.push(cursor.expecting(Kind.Colon));
    value.push(TypeExpression.parseTypeExpression(cursor));
    value.push(Trivia.parse(cursor));

    return value;
  }

  static * parseParameters(cursor: TokenCursor): Iterable<Parameter | Preamble | Token> {
    let preamble = Preamble.parse(cursor);
    while (!cursor.is(Kind.CloseParen)) {
      yield Parameter.parse(cursor, preamble);

      preamble = Preamble.parse(cursor);      // read next set of preamble/trivia data
      if (cursor.is(Kind.Comma)) {
        yield preamble;
        yield cursor.take();
        preamble = Preamble.parse(cursor);      // read next set of preamble/trivia data
        continue;
      }
    }

    if (!preamble.isTrivia) {
      cursor.err('Annotations are not permitted at parser point.');
    }

    yield preamble;                         // trailing trivia before the close brace.
  }
}
