import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Label } from './Label';
import { LiteralValue } from './LiteralValue';
import { Preamble } from './Preamble';
import { RawToken } from './Token';


export class Annotation extends Element {
  readonly kind = Kind.Annotation;
  /** @internal */
  constructor(initializer?: Partial<Annotation>) {
    super();
  }

  static parse(cursor: TokenCursor): Annotation {
    const annotation = new Annotation();

    let usesBrackets = false;

    if (cursor.is(Kind.OpenBracket)) {
      usesBrackets = true;
      // [annotation]
      annotation.push(cursor.expecting(Kind.OpenBracket));
    } else {
      // @annotation
      annotation.push(cursor.expecting(Kind.At));
    }
    annotation.push(Preamble.parse(cursor, true));
    annotation.push(Label.parse(cursor, true));
    annotation.push(Preamble.parse(cursor, true));

    // choices:
    // label
    // label( parameters )


    if (cursor.is(Kind.OpenParen)) {
      annotation.push(cursor.expecting(Kind.OpenParen));
      annotation.push(Annotation.parseParameterValues(cursor));
      annotation.push(cursor.expecting(Kind.CloseParen));
    }
    if (usesBrackets) {
      annotation.push(Preamble.parse(cursor, true));
      annotation.push(cursor.expecting(Kind.CloseBracket));
    }

    return annotation;
  }

  static * parseParameterValues(cursor: TokenCursor): Iterable<LiteralValue | Preamble | RawToken | Array<RawToken>> {
    let preamble = Preamble.parse(cursor, true);
    while (!cursor.is(Kind.CloseParen)) {
      yield preamble;
      yield LiteralValue.parse(cursor);
      preamble = Preamble.parse(cursor, true);      // read next set of preamble/trivia data
      if (cursor.is(Kind.Comma)) {
        yield preamble;
        yield cursor.take();
        preamble = Preamble.parse(cursor, true);      // read next set of preamble/trivia data
        continue;
      }
      if (cursor.is(Kind.CloseParen)) {
        break;
      }
      cursor.err('Unexpected token in parameter values');
    }
    yield preamble;                         // trailing trivia before the close brace.
  }
}
