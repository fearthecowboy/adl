/* eslint-disable no-dupe-class-members */
import { Kind } from '../compiler/scanner';
import { Element, Token } from './Element';
import { RawToken } from './Token';

/** Creates an Element cursor from an Element,  */
export function from(source: Element | Array<Token>, pos = -1) {
  return new ElementCursor(source, pos);
}

type SearchCriteria = Kind | RawToken | Element | ((token: Token) => boolean);

function predicate(criteria: SearchCriteria) {
  return typeof criteria === 'function' ? criteria : (v: any) => (criteria === v || v.kind === criteria);
}

/** An interface over top a collection of Elements/Tokens that provides means to query and mutate them  */
export class ElementCursor {
  private source: Array<Token>;
  /** @internal */ constructor(source: Element | Array<Token>, private pos = -1) {
    this.source = Array.isArray(source) ? source : source.tokens;
  }

  find(kind: Kind): ElementCursor
  find(token: RawToken): ElementCursor
  find(element: Element): ElementCursor
  find(predicate: ((token: Token) => boolean)): ElementCursor
  find(criteria: SearchCriteria): ElementCursor {
    const match = predicate(criteria);
    return new ElementCursor(this.source, this.source.findIndex((v, i, a) => i >= this.pos && match(v)));
  }

  findLast(kind: Kind): ElementCursor
  findLast(token: RawToken): ElementCursor
  findLast(element: Element): ElementCursor
  findLast(predicate: ((token: Token) => boolean)): ElementCursor
  findLast(criteria: SearchCriteria): ElementCursor {
    const match = predicate(criteria);

    for (let i = this.source.length - 1; i > (this).pos; i--) {
      const v = this.source[i];
      if (i >= this.pos && match(v)) {
        return new ElementCursor(this.source, i);
      }
    }
    return new ElementCursor(this.source, -1); // invalid
  }

  findIndex(kind: Kind, startIndex?: number): number
  findIndex(token: RawToken, startIndex?: number): number
  findIndex(element: Element, startIndex?: number): number
  findIndex(predicate: ((token: Token) => boolean), startIndex?: number): number
  findIndex(criteria: SearchCriteria, startIndex?: number): number
  findIndex(criteria: SearchCriteria, startIndex = this.pos): number {
    const match = predicate(criteria);
    return this.source.findIndex((v, i, a) => i >= startIndex && match(v));
  }

  selectAll(criteria: SearchCriteria) {
    const match = predicate(criteria);
    return this.source.where(v => match(v));
  }

  selectRange(firstCriteria: SearchCriteria, lastCriteria: SearchCriteria): Array<Token | Element> {
    const f = this.findIndex(firstCriteria);
    if (f === -1) {
      return [];
    }
    const l = this.findIndex(lastCriteria, f);
    if (l === -1) {
      return [];
    }
    return this.source.slice(f, l);
  }

  get isValid() {
    return this.pos > -1;
  }

  get isInvalid() {
    return this.pos < 0;
  }

  get token() {
    return this.pos > -1 ? this.source[this.pos] : undefined;
  }

  get next() {
    return this.pos < 0 ? new ElementCursor(this.source, 0) :
      this.pos >= this.source.length + 1 ? new ElementCursor(this.source, -1) :
        new ElementCursor(this.source, this.pos + 1);
  }

  get prev() {
    return new ElementCursor(this.source, this.pos < 0 ? -1 : this.pos - 1);
  }

  get last() {
    return new ElementCursor(this.source, this.pos < 0 ? -1 : this.pos - 1);
  }

  remove() {
    const element = this.source[this.pos];
    element.parent.removeChild(element);
    this.pos = -1; // invalidate the cursor.
  }

  insert(...elements: Array<RawToken | Element>) {
    const parent = this.source[this.pos].parent;
    this.source.splice(this.pos, 0, ...elements.map(each => parent.adopt(each)));
    this.pos += elements.length; // move the cursor past the inserted elements.
  }

  add(...elements: Array<RawToken | Element>) {
    const parent = this.source[this.pos].parent;
    this.source.splice(this.pos + 1, 0, ...elements.map(each => parent.adopt(each)));
  }
}
