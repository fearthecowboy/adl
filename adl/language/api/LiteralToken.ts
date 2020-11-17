import { Literal } from './Literal';
import { RawToken } from './Token';

export interface LiteralToken extends RawToken {
  kind: Literal;
}
