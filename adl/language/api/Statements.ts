import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { TypeAlias } from './Alias';
import { Element } from './Element';
import { Enum } from './Enum';
import { Import } from './Import';
import { Interface } from './Interface';
import { Model } from './Model';
import { Preamble } from './Preamble';
import { Token } from './Token';

export class Statements {
  static *parse(cursor: TokenCursor): Iterable<Token | Element> {
    while (!cursor.eof) {
      const preamble = Preamble.parse(cursor);

      switch (cursor.kind) {
        case Kind.FromKeyword:
          if (!preamble.isTrivia) {
            cursor.err('Import statements may not contain an Annotation');
          }
          yield Import.parse(cursor, preamble);
          continue;

        case Kind.ModelKeyword:
          yield Model.parse(cursor, preamble);
          continue;

        case Kind.InterfaceKeyword:
          yield Interface.parse(cursor, preamble);
          continue;

        case Kind.EnumKeyword:
          yield Enum.parse(cursor, preamble);
          continue;

        case Kind.AliasKeyword:
          yield TypeAlias.parse(cursor, preamble);
          continue;

        case Kind.Semicolon: {
          yield preamble;
          yield cursor.take();
          continue;
        }
      }
      if (cursor.eof && preamble.any) {
        yield preamble;
        break;
      }

      throw cursor.err(`Expected statement, but found ${Kind[cursor.kind]}`);
    }
  }
}