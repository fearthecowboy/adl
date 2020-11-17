import { Kind } from '../compiler/scanner';
import { ElementCursor } from './ElementCursor';

/** returns trivia to match the indentation of a given element */
export function getIndentOf(cursor: ElementCursor) {
  let c = cursor.prev;
  let text = '';
  while (c.isValid && c.token!.kind === Kind.Preamble) {
    text = c.token!.text + text;
    c = c.prev;
  }
  return text.replace(/.*?(\n\s*$)/gs, '$1');
}