import { Alias } from './alias';
import { Element } from './element';
import { Schema } from './schema/schema';
import { ReadOnlyCollection } from './types';

export interface Operation extends Element {
  /** A short summary of what the operation does. */
  summary?: string;

  /** A verbose explanation of the operation behavior. Commonmark syntax can be used for rich text representation. */
  description?: string;

  /** parameters common to all the requests(overloads) for this operation */
  readonly parameters: ReadOnlyCollection<Parameter | Alias<Parameter>>;

  /** possible requests that can be made for this operation (ie, overloads)  */
  readonly requests: ReadOnlyCollection<Request | Alias<Request>>;

  /** possible outputs from this operation */
  readonly responses: ReadOnlyCollection<Response | Alias<Response>>;
}

export class Response extends Element {
  /** 
   * indicates that this response should be considered and exception (an error)
   */
  isException?:  boolean;

  /** schema for the response content */
  schema?: Schema;
  /**
   * 
   * @param initializer the object initializer for this response
   */
  constructor(initializer?: Partial<Response>) {
    super();
    this.initialize(initializer);
  }
}


export class Parameter extends Element {
  /**
   * extended description of the schema
   * CommonMark syntax MAY be used for rich text representation.
   */
  description?: string;

  /** 
   * determines whether this parameter is mandatory.
   */
  required?: boolean;

  constructor(public name: string, public schema: Schema, initializer?: Partial<Parameter>) {
    super();
    this.initialize(initializer);
  }
}

export class Request extends Element {

}