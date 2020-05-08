import { anonymous } from '@azure-tools/sourcemap';
import { Element } from './element';
import { Identity } from './name';

export class Schema extends Element {
  anonymous?: boolean;
  /** 
   * name of this schema - may be an alias or an actual string name 
   */
  name: Identity;

  /**
   * short description of the schema
   */
  summary?: string;

  /**
   * extended description of the schema
   * CommonMark syntax MAY be used for rich text representation.
   */
  description?: string;

  /**
   * if null can be substituted for a value for this schema.
   * 
   * @todo: I'm not fond of having this in schema -- we should strongly consider refactoring this so the consumer gets it (ie, the property)
   */
  nullable?:  boolean;
  /**
   * 
   * @param type the schema 'type' that this schema represents. 
   * @param initializer optional object initializer
   */
  constructor(public type: string, initializer?: Partial<Schema>) {
    super();
    this.name = anonymous('');
    this.initialize(initializer);
  }

}

export class Property extends Element {
  /** indicates the properts is required */
  required?: boolean;

  /**
   * Declares the property as "read only".  
   * A property MUST NOT be marked as both readOnly and writeOnly being true. 
   * Default value is false.
   */
  readonly?: boolean;

  /**
   * Declares the property as "write only". 
   * A property MUST NOT be marked as both readOnly and writeOnly being true. 
   * Default value is false.
   * 
   */
  writeonly?: boolean;

  /**
   * Description of the property
   * CommonMark syntax MAY be used for rich text representation.
   */
  description?: string;

  constructor(public name: string, public schema: Schema, initializer?: Partial<Property>) {
    super();
    this.initialize(initializer);
  }
}

export class ObjectSchema extends Schema {
  /** the collection of properties that are in this object */
  properties = new Array<Property>();

  /**  maximum number of properties permitted */
  maxProperties?: number;

  /**  minimum number of properties permitted */
  minProperties?: number;

  /** schemas that this object extends */
  extends = new Array<Schema>();

  constructor(public name: string, initializer?: Partial<ObjectSchema>) {
    super('object');
    this.initialize(initializer);
  }
}

export class Constant extends Schema {
  constructor(public valueSchema: Schema, public value: any, initializer?: Partial<Constant>) {
    super('constant');
    this.initialize(initializer);
  }
}

export class Enum extends Schema {
  values = new Array<Constant>();
  sealed = true;

  constructor(public elementSchema: Schema, initializer?: Partial<Enum>) {
    super('enum');
    this.initialize(initializer);
  }
}

export class Constraint extends Schema {
  constructor(public name: Identity, initializer?: Partial<Constraint>) {
    super('constraint');
    this.initialize(initializer);
  }
}

export class MinimumConstraint extends Constraint {
  constructor(public minimum: number, initializer?: Partial<MinimumConstraint>) {
    super('Minimum');
    this.initialize(initializer);
  }
}

export class MaximumConstraint extends Constraint {
  constructor(public maximum: number, initializer?: Partial<MaximumConstraint>) {
    super('Maximum');
    this.initialize(initializer);
  }
}
export class ExclusiveMinimumConstraint extends Constraint {
  constructor(public minimum: number, initializer?: Partial<ExclusiveMinimumConstraint>) {
    super('ExclusiveMinimum');
    this.initialize(initializer);
  }
}
export class ExclusiveMaximumConstraint extends Constraint {
  constructor(public maximum: number, initializer?: Partial<ExclusiveMaximumConstraint>) {
    super('ExclusiveMaximum');
    this.initialize(initializer);
  }
}

export class MultipleOfConstraint extends Constraint {
  constructor(public multipleOf: number, initializer?: Partial<MultipleOfConstraint>) {
    super('MultipleOf');
    this.initialize(initializer);
  }
}

export class MaxLengthConstraint extends Constraint {
  constructor(public length: number, initializer?: Partial<MaxLengthConstraint>) {
    super('MaxLength');
    this.initialize(initializer);
  }
}
export class MinLengthConstraint extends Constraint {
  constructor(public length: number, initializer?: Partial<MinLengthConstraint>) {
    super('MinLength');
    this.initialize(initializer);
  }
}

export class RegularExpressionConstraint extends Constraint {
  constructor(public length: string, initializer?: Partial<RegularExpressionConstraint>) {
    super('RegularExpression');
    this.initialize(initializer);
  }
}

export class MaximumElementsConstraint extends Constraint {
  constructor(public count: number, initializer?: Partial<MaximumElementsConstraint>) {
    super('MaximumElements');
    this.initialize(initializer);
  }
}


export class MinimumElementsConstraint extends Constraint {
  constructor(public count: number, initializer?: Partial<MinimumElementsConstraint>) {
    super('MinimumElements');
    this.initialize(initializer);
  }
}

export class UniqueElementsConstraint extends Constraint {
  constructor(public unique: boolean, initializer?: Partial<UniqueElementsConstraint>) {
    super('UniqueElements');
    this.initialize(initializer);
  }
}

export class MinimumPropertiesConstraint extends Constraint {
  constructor(public count: number, initializer?: Partial<MinimumPropertiesConstraint>) {
    super('MinimumProperties');
    this.initialize(initializer);
  }
}

export class MaximumPropertiesConstraint extends Constraint {
  constructor(public count: number, initializer?: Partial<MaximumPropertiesConstraint>) {
    super('MaximumProperties');
    this.initialize(initializer);
  }
}

export class AnyOfSchema extends Schema {
  constructor(public name: Identity, public oneOrMoreOf: Array<Schema>, initializer?: Partial<AnyOfSchema>) {
    super('AnyOf');
    this.initialize(initializer);
  }
}

export class AndSchema extends Schema {
  constructor(public name: Identity, public allOf: Array<Schema>, initializer?: Partial<AndSchema>) {
    super('And');
    this.initialize(initializer);
  }
}

export class XorSchema extends Schema {
  constructor(public name: Identity, public oneOf: Array<Schema>, initializer?: Partial<XorSchema>) {
    super('Xor');
    this.initialize(initializer);
  }
}


export class Default extends Schema {
  constructor(public name: Identity, initializer?: Partial<Default>) {
    super('default');
    this.initialize(initializer);
  }
}

export class ServerDefaultValue extends Schema {
  constructor(public value: any, initializer?: Partial<ServerDefaultValue>) {
    super('server-default');
    this.initialize(initializer);
  }
}


export class Alias extends Schema {
  aliasType = 'schema';
  constraints = new Array<Constraint>();
  defaults = new Array<Default>();
  // 
  constructor(public name: Identity, public targetSchema: Schema, initializer?: Partial<Alias>) {
    super('alias');
    this.initialize(initializer);
  }
}

export class Primitive extends Schema {
  constructor(kind: string, initializer?: Partial<Primitive>) {
    super(kind);
    this.initialize(initializer);
  }
}

export class ArraySchema extends Primitive {
  constructor(public elementSchema: Schema, initializer?: Partial<ArraySchema>) {
    super('array');
    this.initialize(initializer);
  }
}

export class DictionarySchema extends Primitive {
  constructor(public elementSchema: Schema, initializer?: Partial<DictionarySchema>) {
    super('dictionary');
    this.initialize(initializer);
  }
}

export class StringPrimitive extends Primitive {
  constructor(initializer?: Partial<StringPrimitive>) {
    super('string');
    this.initialize(initializer);
  }
}

export class Int32Primitive extends Primitive {
  constructor(initializer?: Partial<Int32Primitive>) {
    super('int32');
    this.initialize(initializer);
  }
}

export class Int64Primitive extends Primitive {
  constructor(initializer?: Partial<Int64Primitive>) {
    super('int64');
    this.initialize(initializer);
  }
}

export class BooleanPrimitive extends Primitive {
  constructor(initializer?: Partial<BooleanPrimitive>) {
    super('boolean');
    this.initialize(initializer);
  }
}

export class DoublePrimitive extends Primitive {
  constructor(initializer?: Partial<DoublePrimitive>) {
    super('double');
    this.initialize(initializer);
  }
}

export class FloatPrimitive extends Primitive {
  constructor(initializer?: Partial<FloatPrimitive>) {
    super('float');
    this.initialize(initializer);
  }
}

export class ByteArrayPrimitive extends Primitive {
  constructor(initializer?: Partial<ByteArrayPrimitive>) {
    super('byteArray');
    this.initialize(initializer);
  }
}

export class DatePrimitive extends Primitive {
  constructor(initializer?: Partial<DatePrimitive>) {
    super('date');
    this.initialize(initializer);
  }
}

export class TimePrimitive extends Primitive {
  constructor(initializer?: Partial<TimePrimitive>) {
    super('time');
    this.initialize(initializer);
  }
}

export class DateTimePrimitive extends Primitive {
  constructor(initializer?: Partial<DateTimePrimitive>) {
    super('dateTime');
    this.initialize(initializer);
  }
}

export class DurationPrimitive extends Primitive {
  constructor(initializer?: Partial<DurationPrimitive>) {
    super('duration');
    this.initialize(initializer);
  }
}

export class UuidPrimitive extends Primitive {
  constructor(initializer?: Partial<UuidPrimitive>) {
    super('uuid');
    this.initialize(initializer);
  }
}

export class UriPrimitive extends Primitive {
  constructor(initializer?: Partial<UriPrimitive>) {
    super('uri');
    this.initialize(initializer);
  }
}

export class PasswordPrimitive extends Primitive {
  constructor(initializer?: Partial<PasswordPrimitive>) {
    super('password');
    this.initialize(initializer);
  }
}

export class ODataPrimitive extends Primitive {
  constructor(initializer?: Partial<ODataPrimitive>) {
    super('odata');
    this.initialize(initializer);
  }
}

export class FilePrimitive extends Primitive {
  constructor(initializer?: Partial<FilePrimitive>) {
    super('file');
    this.initialize(initializer);
  }
}


export class CharPrimitive extends Primitive {
  constructor(initializer?: Partial<CharPrimitive>) {
    super('char');
    this.initialize(initializer);
  }
}

export class UnknownSchema extends Primitive {
  constructor(initializer?: Partial<UnknownSchema>) {
    super('unknown');
    this.initialize(initializer);
  }
}

export class AnySchema extends Primitive {
  constructor(initializer?: Partial<AnySchema>) {
    super('any');
    this.initialize(initializer);
  }
}

export class Schemas extends Element {
  addPrimitive<T extends Primitive>(primitive: T): T {
    this.primitives.push(primitive);
    return primitive;
  }
  #unknown?: UnknownSchema;
  #any?: AnySchema;
  #string?: StringPrimitive;
  #char?: CharPrimitive;
  #int32?: Int32Primitive;
  #int64?: Int64Primitive;
  #boolean?: BooleanPrimitive;
  #double?: DoublePrimitive;
  #float?: FloatPrimitive;
  #byteArray?: ByteArrayPrimitive;
  #date?: DatePrimitive;
  #time?: TimePrimitive;
  #dateTime?: DateTimePrimitive;
  #duration?: DurationPrimitive;
  #uuid?: UuidPrimitive;
  #uri?: UriPrimitive;
  #password?: PasswordPrimitive;
  #odata?: ODataPrimitive;
  #file?: FilePrimitive;

  get Unknown(): UnknownSchema {
    return this.#unknown || (this.addPrimitive(this.#unknown = new UnknownSchema()));
  }
  get Any(): AnySchema {
    return this.#any || (this.addPrimitive(this.#any = new AnySchema()));
  }
  get String(): StringPrimitive {
    return this.#string || (this.addPrimitive(this.#string = new StringPrimitive()));
  }
  get Char(): CharPrimitive {
    return this.#char || (this.addPrimitive(this.#char = new CharPrimitive()));
  }
  get Int32(): Int32Primitive {
    return this.#int32 || (this.addPrimitive(this.#int32 = new Int32Primitive()));
  }
  get Int64(): Int64Primitive {
    return this.#int64 || (this.addPrimitive(this.#int64 = new Int64Primitive()));
  }
  get Boolean(): BooleanPrimitive {
    return this.#boolean || (this.addPrimitive(this.#boolean = new BooleanPrimitive()));
  }
  get Double(): DoublePrimitive {
    return this.#double || (this.addPrimitive(this.#double = new DoublePrimitive()));
  }
  get Float(): FloatPrimitive {
    return this.#float || (this.addPrimitive(this.#float = new FloatPrimitive()));
  }
  get ByteArray(): ByteArrayPrimitive {
    return this.#byteArray || (this.addPrimitive(this.#byteArray = new ByteArrayPrimitive()));
  }
  get Date(): DatePrimitive {
    return this.#date || (this.addPrimitive(this.#date = new DatePrimitive()));
  }
  get Time(): TimePrimitive {
    return this.#time || (this.addPrimitive(this.#time = new TimePrimitive()));
  }
  get DateTime(): DateTimePrimitive {
    return this.#dateTime || (this.addPrimitive(this.#dateTime = new DateTimePrimitive()));
  }
  get Duration(): DurationPrimitive {
    return this.#duration || (this.addPrimitive(this.#duration = new DurationPrimitive()));
  }
  get Uuid(): UuidPrimitive {
    return this.#uuid || (this.addPrimitive(this.#uuid = new UuidPrimitive()));
  }
  get Uri(): UriPrimitive {
    return this.#uri || (this.addPrimitive(this.#uri = new UriPrimitive()));
  }
  get Password(): PasswordPrimitive {
    return this.#password || (this.addPrimitive(this.#password = new PasswordPrimitive()));
  }
  get OData(): ODataPrimitive {
    return this.#odata || (this.addPrimitive(this.#odata = new ODataPrimitive()));
  }
  get File(): FilePrimitive {
    return this.#file || (this.addPrimitive(this.#file = new FilePrimitive()));
  }

  objects = new Array<ObjectSchema>();
  combinations = new Array<AndSchema | XorSchema | AnyOfSchema>();
  constants = new Array<Constant>();
  enums = new Array<Enum>();
  constraints = new Array<Constraint>();
  defaults = new Array<Default>();
  aliases = new Array<Alias>();
  primitives = new Array<Primitive>();
}
