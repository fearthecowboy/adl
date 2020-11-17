import { Kind } from '../compiler/scanner';


export interface RawToken {
  /** the character offset within the document */
  readonly offset: number;

  /** the text of the current token (when appropriate) */
  text: string;

  /** the token kind */
  readonly kind: Kind;
}
