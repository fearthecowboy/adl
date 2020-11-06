import { Kind } from '../compiler/scanner';
import { Element } from './Element';


export class Result extends Element {
  readonly kind = Kind.Result;
}
