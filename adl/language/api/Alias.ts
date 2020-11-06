import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Declaration } from './Declaration';
import { Preamble, Trivia } from './Preamble';
import { TypeExpression } from './typeExpression';

export class TypeAlias extends Declaration {
  readonly kind = Kind.TypeAlias;

  static parse(cursor: TokenCursor, preamble: Preamble): TypeAlias | ParameterAlias {
    const alias = new TypeAlias();
    alias.push(preamble);
    alias.push(cursor.expecting(Kind.AliasKeyword));
    alias.push(Trivia.parse(cursor));
    alias.push(cursor.expectingIdentifier());
    alias.push(Trivia.parse(cursor));
    alias.push(cursor.expecting(Kind.Colon));
    alias.push(TypeExpression.parseTypeExpression(cursor));
    alias.push(cursor.expecting(Kind.Semicolon));
    return alias;
  }
}
export class ParameterAlias extends Declaration {
  readonly kind = Kind.ParameterAlias;
}
export class ResponseAlias extends Declaration {
  readonly kind = Kind.ResponseAlias;
}