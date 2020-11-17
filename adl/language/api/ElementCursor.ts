import { Kind } from '../compiler/scanner';
import { isElement, isToken } from '../compiler/tokens';
import { Element, Token } from './Element';
import { RawToken } from './Token';


export function from(source: Element | Array<Token>, pos = -1) {
  return new ElementCursor(source, pos);
}
export class ElementCursor {
  private source: Array<Token>;
  /** @internal */ constructor(source: Element | Array<Token>, private pos = -1) {
    this.source = Array.isArray(source) ? source : source.tokens;
  }
  find(criteria: Kind | RawToken | Element) {
    return new ElementCursor(this.source, this.source.findIndex((v, i, a) => i >= this.pos && (criteria === v || v.kind === criteria)));
  }
  findLast(criteria: Kind | RawToken | Element) {
    for (let i = this.source.length - 1; i > (this).pos; i--) {
      const v = this.source[i];
      if (i >= this.pos && (criteria === v || v.kind === criteria)) {
        return new ElementCursor(this.source, i);
      }
    }
    return new ElementCursor(this.source, -1); // invalid
  }
  findIndex(criteria: Kind | RawToken | Element, startIndex = 0): number {
    return this.source.findIndex((v, i, a) => i >= this.pos && (criteria === v || v.kind === criteria));
  }
  selectAll(criteria: Kind | RawToken | Element) {
    return this.source.where(v => (criteria === v || v.kind === criteria));
  }
  selectRange(firstCriteria: Kind | RawToken | Element, lastCriteria: Kind | RawToken | Element): Array<Token | Element> {
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
  get element() {
    return this.pos > -1 && isElement(this.source[this.pos]) ? <Element>this.source[this.pos] : undefined;
  }
  get rawToken() {
    return this.pos > -1 && isToken(this.source[this.pos]) ? <RawToken>this.source[this.pos] : undefined;
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
