import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Label } from './Label';
import { Parameter } from './Parameter';
import { Preamble, Trivia } from './Preamble';
import { Response } from './Response';
import { Terminator } from './Terminator';

export class Operation extends Element {
  readonly kind = Kind.Operation;

  static parse(cursor: TokenCursor, preamble: Preamble): Operation {
    const operation = new Operation();
    operation.push(preamble);
    operation.push(Label.parse(cursor, false));
    operation.push(Trivia.parse(cursor));
    operation.push(cursor.expecting(Kind.OpenParen));
    operation.push(Parameter.parseParameters(cursor));
    operation.push(cursor.expecting(Kind.CloseParen));
    operation.push(Trivia.parse(cursor));

    if (cursor.is(Kind.Colon)) {
      operation.push(cursor.take());
      operation.push(Response.parseResponse(cursor));
    }

    operation.push(Terminator.parse(cursor, [Kind.CloseBrace], true));

    return operation;
  }

  static * parseOperations(cursor: TokenCursor): Iterable<Operation | Preamble> {
    let preamble = Preamble.parse(cursor);
    while (!cursor.is(Kind.CloseBrace)) {
      yield Operation.parse(cursor, preamble);

      preamble = Preamble.parse(cursor);      // read next set of preamble/trivia data
    }
    if (!preamble.isTrivia) {
      cursor.err('Annotations are not permitted at this point.');
    }
    yield preamble;                         // trailing trivia before the close brace.
  }

}
