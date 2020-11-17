import { TokenCursor } from '../compiler/cursor';
import { Kind } from '../compiler/scanner';
import { isTerminator } from '../compiler/tokens';
import { Element } from './Element';
import { Label } from './Label';
import { Parameter } from './Parameter';
import { Preamble } from './Preamble';
import { ResponseExpression } from './ResponseExpression';
import { TemplateDeclaration, TemplateParameters } from './TemplateDeclaration';
import { RawToken } from './Token';
import { Union } from './Union';


export class Response extends Element {
  readonly kind = Kind.Response;

  static parse(cursor: TokenCursor, preamble: Preamble, templatePermitted: boolean) {
    // response NAME(PARAMETERS) => RESULT

    const responseDecl = new Response();
    responseDecl.push(preamble);
    responseDecl.push(cursor.expecting(Kind.ResponseKeyword));
    responseDecl.push(Preamble.parse(cursor, true));
    responseDecl.push(Label.parse(cursor, false));
    responseDecl.push(Preamble.parse(cursor, true));
    if (templatePermitted && cursor.is(Kind.OpenAngle)) {
      responseDecl.push(TemplateDeclaration.parse(cursor));
      responseDecl.push(Preamble.parse(cursor, true));
    }
    responseDecl.push(cursor.expecting(Kind.OpenParen));
    responseDecl.push(Parameter.parseParameters(cursor));
    responseDecl.push(cursor.expecting(Kind.CloseParen));

    responseDecl.push(Preamble.parse(cursor, true));
    if (cursor.is(Kind.EqualsArrow)) {
      responseDecl.push(cursor.take());
      responseDecl.push(Preamble.parse(cursor, true));
      responseDecl.push(Response.parseOutputExpression(cursor));
    }
    return responseDecl;
  }

  static *parseOutputExpression(cursor: TokenCursor): Iterable<RawToken> {
    // quick and dirty, not complete.
    while (!isTerminator(cursor.kind)) {
      yield cursor.take();
    }
  }


  static parseResponse(cursor: TokenCursor): Response | ResponseExpression | Union<ResponseExpression | Response> {

    let union: Union<ResponseExpression> | undefined;

    let preamble = Preamble.parse(cursor);
    do {
      if (cursor.is(Kind.ResponseKeyword)) {
        const response = Response.parse(cursor, preamble, false);
        preamble = Preamble.parse(cursor);
        if (!cursor.is(Kind.Bar)) {
          // it's just a lone response
          if (preamble.any) {
            // give back the preamble.
            cursor.peekAhead = preamble;
          }

          // // the end of the union.
          if (union) {
            union.push(response);
            return union;
          }

          // just a lone response.
          return response;
        }

        // it's already or will be a union. Add it to the union, and continue
        union = union || new Union();
        union.push(response);
        union.push(preamble); // trailing trivia
        union.push(cursor.expecting(Kind.Bar));

        // keep going.
        continue;
      }

      // not an inline response, should be a Label some kind
      const responseEx = new ResponseExpression();
      responseEx.push(preamble);
      responseEx.push(Label.parse(cursor, true));
      if (cursor.is(Kind.OpenAngle)) {
        // it has template parameters
        responseEx.push(TemplateParameters.parse(cursor));
      }
      preamble = Preamble.parse(cursor);

      if (!cursor.is(Kind.Bar)) {
        // it's just a lone response
        if (preamble.any) {
          // give back the preamble.
          cursor.peekAhead = preamble;
        }

        // the end of the union.
        if (union) {
          union.push(responseEx);
          return union;
        }

        // it's all alone.
        return responseEx;
      }

      // it's already or will be a union. Add it to the union, and continue
      union = union || new Union();
      union.push(responseEx);
      union.push(preamble); // trailing trivia
      union.push(cursor.expecting(Kind.Bar));
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

}
