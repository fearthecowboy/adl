import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { isTerminator } from '../compiler/tokens';
import { Declaration } from './Declaration';
import { Label } from './Label';
import { Operation } from './Operation';
import { Preamble, Trivia } from './Preamble';
import { Terminator } from './Terminator';


export class Interface extends Declaration {
  readonly kind = Kind.Interface;

  static parse(cursor: TokenCursor, preamble: Preamble): Interface {
    const iface = new Interface();

    iface.push(preamble);
    iface.push(cursor.expecting(Kind.InterfaceKeyword));                  // 'interface' keyword
    iface.push(Trivia.parse(cursor));                                 // trivia
    iface.push(Label.parse(cursor));                             // name
    iface.push(Trivia.parse(cursor));                                 // trivia

    if (isTerminator(cursor.kind)) {
      // empty interface declaration
      iface.push(Terminator.parse(cursor));
      return iface;
    }

    iface.push(cursor.expecting(Kind.OpenBrace));
    iface.push(Operation.parseOperations(cursor));
    iface.push(cursor.expecting(Kind.CloseBrace));

    return iface;
  }
}
