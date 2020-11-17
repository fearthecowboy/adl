import { Element, Token } from './Element';
import { RawToken } from './Token';

export class Container {
  /** @internal */ readonly tokens = new Array<Token>();

  adopt(token: RawToken | Element): Token {
    (<Token>token).parent = this;
    (<Token>token).remove = (<Token>token).remove || (() => {
      this.removeChild((<Token>token));
    });
    return (<Token>token);
  }

  removeChild(child: Token) {
    // find the token and remove it.
    this.tokens.splice(this.tokens.indexOf(child), 1);
  }

  /** @internal */ constructor() {
    // it's ok
  }
}
