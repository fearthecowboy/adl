import { Kind } from '../compiler/scanner';
import { isElement, isToken } from '../compiler/tokens';
import { Element } from './Element';
import { Token } from './Token';

export class ElementCursor {
  constructor(private source: Element, private pos = -1) {
  }
  find(criteria: Kind | Token | Element) {
    return new ElementCursor(this.source, this.source.tokens.findIndex((v, i, a) => i >= this.pos && (criteria === v || v.kind === criteria)));
  }
  findRange(criteria: Kind | Token | Element, toCriteria: Kind | Token | Element) {
    /// this.source.tokens.find((v, i, a) => i >= this.pos && (criteria === v || v.kind === criteria)).map( each => new ElementCursor(each))
    // return new ElementCursor(this.source, this.source.tokens.find((v, i, a) => i >= this.pos && (criteria === v || v.kind === criteria)));
  }
  get isValid() {
    return this.pos > -1;
  }
  get isInvalid() {
    return this.pos < 0;
  }
  get element() {
    return this.pos > -1 && isElement(this.source.tokens[this.pos]) ? <Element>this.source.tokens[this.pos] : undefined;
  }
  get token() {
    return this.pos > -1 && isToken(this.source.tokens[this.pos]) ? <Token>this.source.tokens[this.pos] : undefined;
  }
  get next() {
    return this.pos < 0 ? new ElementCursor(this.source, 0) :
      this.pos >= this.source.tokens.length + 1 ? new ElementCursor(this.source, -1) :
        new ElementCursor(this.source, this.pos + 1);
  }
  get prev() {
    return new ElementCursor(this.source, this.pos < 0 ? -1 : this.pos - 1);
  }
  get last() {
    return new ElementCursor(this.source, this.pos < 0 ? -1 : this.pos - 1);
  }
  remove() {
    this.pos > -1 && this.source.tokens.splice(this.pos, 1);
    this.pos = -1;
  }
  insert(...elements: Array<Token | Element>) {
    this.source.tokens.splice(this.pos, 0, ...elements);
    this.pos += elements.length;
  }
  add(...elements: Array<Token | Element>) {
    this.source.tokens.splice(this.pos + 1, 0, ...elements);
  }
}
