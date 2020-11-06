import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Preamble, Trivia } from './Preamble';


export class Identifier extends Element {
  readonly kind = Kind.Identifier;

  static parse(cursor: TokenCursor, scoped = false) {
    const identifier = new Identifier();
    identifier.push(cursor.expecting(Kind.Identifier));

    if (scoped) {
      const preamble = Preamble.parse(cursor);
      if (cursor.is(Kind.Dot)) {
        identifier.push(preamble);
        identifier.push(cursor.take());
        identifier.push(Trivia.parse(cursor));
        identifier.push(cursor.expecting(Kind.Identifier));
        return identifier;
      }

      // the current token wasn't a colon, we have to give the preamble back.
      if (preamble.any) {
        cursor.peekAhead = preamble;
      }
    }
    return identifier;
  }
}
