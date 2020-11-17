import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Declaration } from './Declaration';
import { Element } from './Element';
import { Label } from './Label';
import { LiteralValue } from './LiteralValue';
import { Preamble } from './Preamble';
import { Terminator } from './Terminator';
import { RawToken } from './Token';


export class Enum extends Declaration {
  readonly kind = Kind.Enum;
  /*
   // docs of the enum
   enum NAME {
    // docs of this enumvalue.
    VNAME = 'somevalue';

    // docs of this enumvalue.
    VNAME2 = 'somevalue2';
   }
  */
  createValue(name: string, value: string): EnumValue {
    const v = new EnumValue(/*this*/);
    v.name = name;
    v.value = value;

    return v;
  }

  static parse(cursor: TokenCursor, preamble: Preamble): Enum {
    const enm = new Enum();
    enm.push(preamble);
    enm.push(cursor.expecting(Kind.EnumKeyword));                  // 'enum' keyword
    enm.push(Preamble.parse(cursor, true));                                 // trivia
    enm.push(Label.parse(cursor));                             // name
    enm.push(Preamble.parse(cursor, true));                                 // trivia

    enm.push(cursor.expecting(Kind.OpenBrace));
    enm.push(EnumValue.parseEnumValues(cursor));
    enm.push(cursor.expecting(Kind.CloseBrace));
    return enm;
  }
}

export class EnumValue extends Declaration {
  kind = Kind.EnumValue;
  #name!: RawToken;
  #value!: RawToken;


  /** @internal */
  craft() {
    /*
    this.parent.lastNode.insert(
      // foo = 'value';

      { token: Kind.Identifier, value: 'foo' }
      { token: Kind.Whitespace, value: ' ' }
      { token: Kind.StringLiteral, value: `'value'` }
      { token: Kind.Semicolon, value: ';' }
      )
      */
  }

  get name(): string {
    return this.#name.text;
  }

  set name(name: string) {
    this.#name.text = name;
  }

  get value(): string {
    return this.#value.text;
  }

  set value(name: string) {
    this.#value.text = name;
  }

  remove() {
    // removes this from the parent
  }

  static parse(cursor: TokenCursor, preamble: Preamble) {
    const value = new EnumValue();
    value.push(preamble);
    value.push(Label.parse(cursor, false));
    value.push(Preamble.parse(cursor, true));
    value.push(cursor.expecting(Kind.Colon));
    value.push(LiteralValue.parse(cursor));
    value.push(Preamble.parse(cursor, true));
    value.push(Terminator.parse(cursor, [Kind.CloseBrace], true));
    return value;
  }

  static *parseEnumValues(cursor: TokenCursor): Iterable<EnumValue | Element | RawToken> {
    let preamble = Preamble.parse(cursor);
    while (!cursor.is(Kind.CloseBrace)) {
      yield EnumValue.parse(cursor, preamble);

      preamble = Preamble.parse(cursor);      // read next set of preamble/trivia data
    }

    if (!preamble.isTrivia) {
      cursor.err('Annotations are not permitted at this point.');
    }

    yield preamble;                         // trailing trivia before the close brace.

  }
}
