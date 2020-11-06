import { Kind } from '../compiler/scanner';
import { Element } from './Element';

export class Union<T extends Element> extends Element {
  readonly kind = Kind.Union;

  get elements(): Array<T> {
    return [];
  }
}
