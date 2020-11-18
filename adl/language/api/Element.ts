/* eslint-disable no-dupe-class-members */
import { Kind, Scanner } from '../compiler/scanner';
import { isElement, isIterable } from '../compiler/tokens';
import { Container } from './Container';
import { from } from './ElementCursor';
import { Preamble } from './Preamble';
import { RawToken } from './Token';

export type AnyToken = RawToken | Element | Iterable<AnyToken>;

export interface Token extends RawToken {
  parent: Container;
  remove(): void;
}

/** an Element is the base class for anything that may be composed of multiple tokens  */
export abstract class Element extends Container implements Token {
  readonly abstract kind: Kind;
  parent!: Container;
  offset = 0;

  /** @internal */ readonly tokens = new Array<Token>();
  /** @internal */ constructor(...tokens: Array<AnyToken | string>) {
    super();
    this.push(tokens);
  }

  /** @internal */ push(token: AnyToken | string): RawToken | Element | undefined {
    if (typeof token === 'string') {
      token = [...Scanner.TokensFrom(token)];
    }
    if (isIterable(token)) {
      for (const t of token) {
        this.push(t);
      }
    } else {
      if (!(<Element>token).empty) { // skip empty elements
        if ((<any>token).parent) {
          // if the token/element has a parent, this isn't ok.

          // we can check if the parent listed actually owns this
          // because if it doesn't, we can assume it's been removed
          // from the parent and is being put into this element.

          if ((<any>token).parent.tokens.find(token)) {
            throw new Error('Tokens/Elements can not be added to mulitple parents.');
          }
          // otherwise, we'll just reset it anyway.
        }
        this.tokens.push(this.adopt(token));
      }
    }
    return this.tokens.last;
  }

  get indentation(): string {
    return (<Preamble>from(this).find(Kind.Preamble).token)?.indentation || '\n  ';
  }

  remove() {
    this.parent.removeChild(this);
  }

  get length() {
    return this.tokens.length;
  }

  /** returns the text of this element (by reconstituting the tokens into text)  */
  get text(): string {
    return this.tokens.select(each => (<RawToken>each).offset === -1 ? '' : each.text).join('');
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
