import { Literal } from './Literal';
import { Token } from './Token';

export interface LiteralToken extends Token {
  kind: Literal;
}
