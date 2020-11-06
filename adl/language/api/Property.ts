import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Identifier } from './Identifier';
import { Preamble, Trivia } from './Preamble';
import { Terminator } from './Terminator';
import { Token } from './Token';
import { TypeExpression } from './typeExpression';


export class Property extends Element {
  kind = Kind.Property;

  get name() {
    throw new Error('Not Implemented');
  }

  set name(name: string) {
    //
  }

  get type(): TypeExpression {
    throw new Error('Not Implemented');
  }

  set type(type: TypeExpression) {
    //
  }

  remove() {
    // removes this from the parent
  }

  static parse(cursor: TokenCursor, preamble: Preamble) {
    const value = new Property();
    value.push(preamble);
    value.push(Identifier.parse(cursor, false));
    value.push(Trivia.parse(cursor));

    value.push(cursor.expecting(Kind.Colon));
    value.push(TypeExpression.parseTypeExpression(cursor));
    value.push(Trivia.parse(cursor));

    value.push(Terminator.parse(cursor));
    return value;
  }

  static *parseProperties(cursor: TokenCursor): Iterable<Token | Property | Preamble> {
    let preamble = Preamble.parse(cursor);
    while (!cursor.is(Kind.CloseBrace)) {
      yield Property.parse(cursor, preamble);

      preamble = Preamble.parse(cursor);      // read next set of preamble/trivia data
    }

    if (!preamble.isTrivia) {
      cursor.err('Annotations are not permitted at this point.');
    }

    yield preamble;                         // trailing trivia before the close brace.
  }
}
