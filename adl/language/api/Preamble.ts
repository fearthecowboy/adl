import { linq } from '@azure-tools/linq';
import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Annotation } from './Annotation';
import { Element } from './Element';
import { from } from './ElementCursor';
import { RawToken } from './Token';


/** A set of nodes that can be trivia and Annotations. */
export class Preamble extends Element {

  get notEmpty(): Preamble | Array<RawToken> {
    return this.any ? this : [];
  }

  kind = Kind.Preamble;

  get annotations() {
    return linq.values(this.tokens).where(each => each.kind === Kind.Annotation);
  }

  get documentation() {
    return this.tokens.where(each => each.kind === Kind.Documentation);
  }

  get isTrivia() {
    return !this.tokens.some(each => each.kind === Kind.Annotation);
  }

  get indentation(): string {
    // grab the first whitespace after the first newline (or the first whitespace if there is no newline)
    const t = from(this).find(Kind.NewLine).find(Kind.Whitespace);
    return `\n${t.token?.text || '  '}`;
  }

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
          if (justTrivia && !preamble.isTrivia) {
            cursor.err('Annotations are not permitted at this point.');
          }
          return preamble;
      }
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }
}