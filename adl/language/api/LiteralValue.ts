import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Literal } from './Literal';
import { LiteralToken } from './LiteralToken';

export class LiteralValue extends Element {
  get kind(): Literal {
    return <Literal>(this.tokens[0].kind);
  }
  constructor(token: LiteralToken) {
    super([token]);
  }

  static parse(cursor: TokenCursor) {
    switch (cursor.kind) {
      case Kind.FalseKeyword:
      case Kind.TrueKeyword:
      case Kind.NumericLiteral:
      case Kind.StringLiteral:
        return new LiteralValue(<LiteralToken>cursor.take());
    }
    cursor.err('Expecting a literal value');
  }
}
