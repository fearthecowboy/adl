import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { Element } from './Element';
import { Trivia } from './Preamble';
import { Token } from './Token';
import { TypeExpression } from './typeExpression';


export class InheritanceDeclaration extends Element {
  kind = Kind.Parent;

  static * parse(cursor: TokenCursor): Iterable<Token | Element> {
    // foo : bar, bin, baz<I>
    do {
      const parent = new InheritanceDeclaration();
      parent.push(TypeExpression.parseTypeExpression(cursor));
      parent.push(Trivia.parse(cursor));
      if (cursor.is(Kind.Comma)) {
        parent.push(cursor.expecting(Kind.Comma));
        yield parent;
        continue;
      }
      yield parent;
      break;
    } while (true);
  }

}
