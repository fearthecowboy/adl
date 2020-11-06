import { linq } from '@azure-tools/linq';
import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { isAnnotation, isTrivia } from '../compiler/tokens';
import { Annotation } from './Annotation';
import { Element } from './Element';
import { Token } from './Token';

export class TriviaBase extends Element {
  get notEmpty(): Preamble | Array<Token> {
    return this.any ? this : [];
  }

  get kind(): Kind.Preamble | Kind.Trivia {
    return this.tokens.any(token => isAnnotation(token)) ? Kind.Preamble : Kind.Trivia;
  }

  get annotations() {
    return linq.values(this.tokens).where(each => each.kind === Kind.Annotation);
  }

  get documentation() {
    return this.tokens.where(each => each.kind === Kind.Documentation);
  }

  get isTrivia() {
    return !this.tokens.any(each => each.kind === Kind.Annotation);
  }
}

/** A set of nodes that can be trivia and Annotations. */
export class Preamble extends TriviaBase {

  // We always parse Trivia and Preamble with this method, but we can choose to allow annotations or not.
  static parse(cursor: TokenCursor, justTrivia = false) {
    // if we have a cached preamble because we tried to lookahead
    if (cursor.peekAhead) {
      const result = cursor.peekAhead;
      cursor.peekAhead = undefined;
      return result;
    }

    const preamble = new Preamble();
    do {
      switch (cursor.kind) {
        case Kind.Whitespace:
        case Kind.NewLine:
        case Kind.MultiLineComment:
        case Kind.SingleLineComment:
          preamble.push(cursor.take());
          continue;

        case Kind.At:
        case Kind.OpenBracket:
          preamble.push(Annotation.parse(cursor));
          continue;

        default:
          if (justTrivia && !isTrivia(preamble)) {
            cursor.err('Annotations are not permitted at this point.');
          }
          return preamble;
      }
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }
}

/** Trivia contains whitespace and comments  */
export class Trivia extends TriviaBase {
  get notEmpty(): Preamble | Array<Token> {
    return this.any ? this : [];
  }

  static parse(cursor: TokenCursor) {
    return Preamble.parse(cursor, true).notEmpty;
  }
}
