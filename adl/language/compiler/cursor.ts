/* eslint-disable no-dupe-class-members */

import { Preamble } from '../api/Preamble';
import { SourceFile } from '../api/SourceFile';
import { Token } from '../api/Token';
import { format } from './messages';
import { Kind, Scanner } from './scanner';

export class TokenCursor extends Scanner {
  #peekAhead?: Preamble;

  get peekAhead() {
    return this.#peekAhead;
  }

  set peekAhead(v: Preamble | undefined) {
    this.#peekAhead = v;
  }

  /** @internal */ constructor(public readonly sourceFile: SourceFile) {
    super(sourceFile.text);
    this.onError = (msg, params) => this.err(format(msg.text, ...params));
  }

  is(kind: Kind) {
    return this.kind === kind;
  }

  err(msg: string): never {
    throw new Error(`[${this.position.line + 1}, ${this.position.character + 1}] ('${this.text}') ${msg}`);
  }

  expectingIdentifier() {
    // if we're expecting an identifier, keywords are OK as identifiers.
    if (this.kind > Kind.KeywordsStart && this.kind < Kind.KeywordsEnd) {
      const result = { ...this.take(), kind: Kind.Identifier };
      return result;
    }
    return this.expecting(Kind.Identifier);
  }

  expecting(kind: Kind, ...or: Array<Kind>): Token {
    if (this.is(kind)) {
      return this.take();
    } else {
      if (or.any(each => this.is(each))) {
        return this.take();
      }
      throw this.err(`expected ${Kind[kind]}, got ${Kind[this.kind]}`);
    }
  }
}