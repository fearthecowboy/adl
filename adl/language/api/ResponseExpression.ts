import { Kind } from '../compiler/scanner';
import { Element } from './Element';


export class ResponseExpression extends Element {
  readonly kind = Kind.ResponseExpression;

}
