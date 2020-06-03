import * as base from '../operation';
import { Schema } from '../schema/schema';


export enum RenderStyle {
  /** Path-style parameters defined by RFC6570 */
  Matrix = 'matrix',

  /** Label style parameters defined by RFC6570 */
  Label = 'label',

  /** Simple style parameters defined by RFC6570. This option replaces collectionFormat with a csv value from OpenAPI 2.0. */
  Simple = 'simple',

  /** Form style parameters defined by RFC6570. This option replaces collectionFormat with a csv (when explode is false) or multi (when explode is true) value from OpenAPI 2.0. */
  Form = 'form',

  /** Space separated array values. This option replaces collectionFormat equal to ssv from OpenAPI 2.0. */
  SpaceDelimited = 'spaceDelimited',

  /** Pipe separated array values. This option replaces collectionFormat equal to pipes from OpenAPI 2.0. */
  PipeDelimited = 'pipeDelimited',

  /** Provides a simple way of rendering nested objects using form parameters. */
  DeepObject = 'deepObject'
}

export enum ParameterType {
  Path = 'path',
  Query = 'query',
  FormData = 'formData',
  Cookie = 'cookie',
  Header = 'header'
}

export type Parameter = PathParameter | QueryParameter | FormDataParameter | CookieParameter | HeaderParameter;

export abstract class ParameterBase extends base.Parameter {
  readonly abstract type: ParameterType;
  /**
   * the styling to use when rendering the parameter into the HTTP request
   */
  readonly renderStyle?: RenderStyle;

  /** 
   * the desired generated location when generating code.
   */
  generatedLocation?: 'client'|'method';
  
  /**
   * @param name the name of this parameter
   * @param schema the type for the parameter
   * @param initializer an object initializer
   */
  constructor(name: string, public schema: Schema, initializer?: Partial<ParameterBase>) {
    super(name, schema);
    this.initialize(initializer);
  }
}

export class PathParameter extends ParameterBase {
  readonly type = ParameterType.Path;

  /** 
   * the styling to use when rendering the parameter into the HTTP request
   */
  renderStyle?: RenderStyle.Matrix | RenderStyle.Label | RenderStyle.Simple;

  /**
     * 
     * @param name the name of this parameter
     * @param schema the type for the parameter
     * @param expandParameterValues 	When this is true, parameter values of type array or object generate separate parameters for each value of the array or key-value pair of the map.
     * @param initializer an object initializer
     */
  constructor(name: string, schema: Schema, public expandParameterValues: boolean, initializer?: Partial<PathParameter>) {
    super(name, schema);
    this.initialize(initializer);
  }
}

export class QueryParameter extends ParameterBase {
  readonly type = ParameterType.Query;

  /** 
  * the styling to use when rendering the parameter into the HTTP request
  */
  renderStyle?: RenderStyle.Form | RenderStyle.PipeDelimited | RenderStyle.SpaceDelimited | RenderStyle.DeepObject;

  /** Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 :/?#[]@!$&'()*+,;= to be included without percent-encoding. This property only applies to parameters with an in value of query. The default value is false. */
  allowReserved?: boolean;

  /** Sets the ability to pass empty-valued parameters. 
   * This is valid only for query parameters and allows sending a parameter with an empty value. 
   * Default value is false. If style is used, and if behavior is n/a (cannot be serialized), the value of allowEmptyValue SHALL be ignored. Use of this property is NOT RECOMMENDED, as it is likely to be removed in a later revision. 
   * 
   * @deprecated
   */
  allowEmptyValue?: boolean;

  /**
    * 
    * @param name the name of this parameter
    * @param schema the type for the parameter
    * @param expandParameterValues 	When this is true, parameter values of type array or object generate separate parameters for each value of the array or key-value pair of the map.
    * @param initializer an object initializer
    */
  constructor(name: string, schema: Schema, public expandParameterValues: boolean, initializer?: Partial<QueryParameter>) {
    super(name, schema, {
      renderStyle: RenderStyle.Simple
    });
    this.initialize(initializer);
  }
}

export class FormDataParameter extends ParameterBase  {
  readonly type = ParameterType.FormData;
  /** 
  * the styling to use when rendering the parameter into the HTTP request
  */
  renderStyle?: RenderStyle.Form | RenderStyle.PipeDelimited | RenderStyle.SpaceDelimited | RenderStyle.DeepObject;

  /** Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 :/?#[]@!$&'()*+,;= to be included without percent-encoding. This property only applies to parameters with an in value of query. The default value is false. */
  allowReserved?: boolean;

  /**
    * 
    * @param name the name of this parameter
    * @param schema the type for the parameter
    * @param expandParameterValues 	When this is true, parameter values of type array or object generate separate parameters for each value of the array or key-value pair of the map.
    * @param initializer an object initializer
    */
  constructor(name: string, schema: Schema, public expandParameterValues: boolean, initializer?: Partial<QueryParameter>) {
    super(name, schema, {
      renderStyle: RenderStyle.Simple
    });
    this.initialize(initializer);
  }
}

export class CookieParameter extends ParameterBase {
  readonly type = ParameterType.Cookie;
  /**
     * 
     * @param name the name of this parameter
     * @param schema the type for the parameter
     * @param expandParameterValues 	When this is true, parameter values of type array or object generate separate parameters for each value of the array or key-value pair of the map.
     * @param initializer an object initializer
     */
  constructor(name: string, schema: Schema, public expandParameterValues: boolean, initializer?: Partial<PathParameter>) {
    super(name, schema, {
      renderStyle: RenderStyle.Simple
    });
    this.initialize(initializer);
  }
}

export class HeaderParameter extends ParameterBase {
  readonly type = ParameterType.Header;

  /** 
  * the styling to use when rendering the parameter into the HTTP request
  */
  renderStyle?: RenderStyle.Simple;

  /**
     * 
     * @param name the name of this parameter
     * @param schema the type for the parameter
     * @param expandParameterValues 	When this is true, parameter values of type array or object generate separate parameters for each value of the array or key-value pair of the map.
     * @param initializer an object initializer
     */
  constructor(name: string, schema: Schema, public expandParameterValues: boolean, initializer?: Partial<HeaderParameter>) {
    super(name, schema);
    this.initialize(initializer);
  }
}
