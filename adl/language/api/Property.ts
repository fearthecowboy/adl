import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { from } from './ElementCursor';
import { Label } from './Label';
import { Preamble } from './Preamble';
import { Terminator } from './Terminator';
import { RawToken } from './Token';
import { TypeExpression } from './typeExpression';


export class Property extends Element {
  kind = Kind.Property;

  get name() {
    return (<Label>from(this).find(Kind.Label).element).name;
  }

  set name(name: string) {
    (<Label>from(this).find(Kind.Label).element).name = name;
  }

  get type(): TypeExpression {
    return from(this).find(Kind.TypeExpression).element!;
  }

  set type(type: TypeExpression) {
    //
  }

  static parse(cursor: TokenCursor, preamble: Preamble) {
    const value = new Property();
    value.push(preamble);
    value.push(Label.parse(cursor, false));
    value.push(Preamble.parse(cursor, true));

    value.push(cursor.expecting(Kind.Colon));
    value.push(TypeExpression.parseTypeExpression(cursor));
    value.push(Preamble.parse(cursor, true));

    value.push(Terminator.parse(cursor, [Kind.CloseBrace], true));
    return value;
  }

  static *parseProperties(cursor: TokenCursor): Iterable<RawToken | Property | Preamble> {
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
