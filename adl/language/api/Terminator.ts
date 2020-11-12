import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Preamble } from './Preamble';

export class Terminator {
  static * parse(cursor: TokenCursor, insertTerminatorOn: Array<Kind> = [], consumeExtraTerminators = false) {
    do {
      if (cursor.kind === Kind.Semicolon) {
        yield cursor.take();

        if (consumeExtraTerminators) {
          // let's peek and see if there is just trivia and terminators past here.
          const preamble = Preamble.parse(cursor);
          if (preamble.isTrivia && cursor.kind === Kind.Semicolon) {
            yield preamble;
            continue;
          }
          // nope, let's put back the preamble and leave
          cursor.peekAhead = preamble;
        }
        break;
      }

      if (insertTerminatorOn.includes(cursor.kind)) {
        // auto-insert terminator.
        console.log('warning: inserting missing terminator');
        yield { offset: -1, kind: Kind.Semicolon, text: ';' };
        break;
      }

      // nope. found something else.
      cursor.err('Expecting terminator character (\';\') ');
    } while (true);
  }
}