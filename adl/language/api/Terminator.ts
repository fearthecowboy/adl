import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';

export class Terminator {
  static parse(cursor: TokenCursor) {
    switch (cursor.kind) {
      case Kind.Semicolon:
        return cursor.take();

      case Kind.CloseBrace:
        console.log('warning: inserting missing semicolon');
        return { offset: -1, kind: Kind.Semicolon, text: ';' };

      case Kind.CloseParen:
        //  console.log('warning: inserting missing semicolon');
        return { offset: -1, kind: Kind.Semicolon, text: ';' };
    }
    cursor.err('Expecting Semicolon');
  }
}