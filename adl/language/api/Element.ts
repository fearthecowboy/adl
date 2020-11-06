/* eslint-disable no-dupe-class-members */
import { items } from '@azure-tools/linq';
import { Kind } from '../compiler/scanner';
import { isElement, isIterable, isToken } from '../compiler/tokens';
import { Token } from './Token';


export class ElementCursor {
  readonly tokens: Array<Token | Element>;
  pos = 0;
  constructor(element: { readonly tokens: Array<Token | Element> }) {
    this.tokens = element.tokens;
  }

  find(criteria: Kind | Element) {
    let current = this.tokens[this.pos];
    while (current !== criteria && current.kind !== criteria && this.pos < this.tokens.length) {
      current = this.tokens[++this.pos];
    }
    return this;
  }

  get invalid() {
    return this.pos >= this.tokens.length;
  }

  reset() {
    this.pos = 0;
    return this;
  }

  get next() {
    this.pos++;
    return this;
  }

  get text() {
    return this.tokens[this.pos].text;
  }

  set text(text: string) {
    const token = this.tokens[this.pos];
    if (isToken(token)) {
      token.text = text;
    }
  }

  get element(): Element | undefined {
    const t = this.tokens[this.pos];
    return isElement(t) ? t : undefined;
  }

}

/** an Element is the base class for anything that may be composed of multiple tokens  */

export type AnyToken = Token | Element | Iterable<AnyToken>;

export abstract class Element {
  readonly abstract kind: Kind;

  find(criteria: Kind | Element) {
    return new ElementCursor(this).find(criteria);
  }

  /** allows subclasses to trivially implement object initializers */
  protected initialize<T>(initializer?: Partial<T>) {
    for (const [key, value] of items(initializer)) {
      // copy the true value of the items to the object
      // (use the proxy)
      const rawThis = <any>this;

      if (value !== undefined) {
        const rawValue = (<any>value);
        const targetProperty = rawThis[key];
        if (targetProperty && targetProperty.push) {
          if (rawValue[Symbol.iterator]) {
            // copy elements to target
            for (const each of rawValue) {
              rawThis[key].push(each);
            }
            continue;
          }
          throw new Error(`Initializer for object with array member '${key}', must be initialized with something that can be iterated.`);
        }
        // just copy the value across.
        rawThis[key] = (<any>value);
      }
    }
    return this;
  }

  /** @internal */ readonly tokens = new Array<Token | Element>();
  /** @internal */ constructor(tokens: Array<AnyToken> = []) {
    this.push(tokens);
    // this.parse`adasdas`;
  }

  // parse(code: TemplateStringsArray, ...args: Array<string>) {
  //}

  /** @internal */ push(token: AnyToken): Token | Element | undefined {
    // if ((<any>token).take) {
    // return this.push((<any>token).take());
    // }
    if (isIterable(token)) {
      for (const t of token) {
        this.push(t);
      }
    } else {
      if (!(<Element>token).empty) {
        this.tokens.push(token);
      }
    }
    return this.tokens.last;
  }

  /** returns the text of this element (by reconstituting the tokens into text)  */
  get text(): string {
    return this.tokens.select(each => (<Token>each).offset === -1 ? '' : each.text).join('');
  }

  // returns the AST for this element
  get AST(): Array<Token> {
    return this.tokens.selectMany(each => isElement(each) ? each.AST : each);
  }

  get any() {
    return this.tokens.length > 0;
  }

  get empty() {
    return this.tokens.length === 0;
  }

  save(autofix = false) {
    for (const t of this.tokens) {
      if (isElement(t)) {
        t.save(autofix);
      } else {
        if (autofix && t.offset === -1) {
          (<any>t).offset = 0;
        }
      }
    }
  }

}
