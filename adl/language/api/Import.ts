import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Preamble, Trivia } from './Preamble';
import { Terminator } from './Terminator';


export class Import extends Element {
  readonly kind = Kind.Import;
  static parse(cursor: TokenCursor, trivia: Preamble): Import {
    // from 'foo' import { what, you, want};
    // from 'foo' import *;
    const result = new Import();
    result.push(trivia);
    result.push(cursor.expecting(Kind.FromKeyword));
    result.push(Trivia.parse(cursor));
    result.push(cursor.expectingIdentifier());
    result.push(Trivia.parse(cursor));
    result.push(cursor.expecting(Kind.ImportKeyword));
    result.push(Trivia.parse(cursor));
    if (cursor.is(Kind.OpenBrace)) {
      result.push(cursor.expecting(Kind.OpenBrace));
      do {
        result.push(Trivia.parse(cursor));
        if (cursor.is(Kind.Identifier) || (cursor.kind > Kind.KeywordsStart && cursor.kind < Kind.KeywordsEnd)) {
          result.push(cursor.expectingIdentifier());
          result.push(Trivia.parse(cursor));
          if (cursor.is(Kind.Comma)) {
            result.push(cursor.take());
            if (<Kind>cursor.kind !== Kind.CloseBrace) {
              continue;
            }
          }
        }
        result.push(cursor.expecting(Kind.CloseBrace));
        result.push(Trivia.parse(cursor));
        result.push(Terminator.parse(cursor));
        return result;
      }
      // eslint-disable-next-line no-constant-condition
      while (true);
    }

    result.push(cursor.expecting(Kind.Asterisk));
    result.push(Trivia.parse(cursor));
    result.push(Terminator.parse(cursor));
    return result;
  }
}
