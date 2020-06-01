import { TypeDeclaration } from '../../support/typescript';
import { Schema, TSSchema } from './schema';

export class Primitive extends Schema {
  constructor(protected kind: string, initializer?: Partial<Primitive>) {
    super(kind);
    this.initialize(initializer);
  }
  get isInline(): boolean {
    return true;
  }

  get typeDefinition(): string {
    return <string>this.kind;
  }
}

export class ArraySchema extends Primitive {
  constructor(public elementSchema: Schema, initializer?: Partial<ArraySchema>) {
    super('array');
    this.initialize(initializer);
  }
  get typeDefinition(): string {
    return `Array<${this.elementSchema.typeDefinition}>`;
  }
  get requiredTypeDeclarations(): Array<TypeDeclaration> {
    return this.elementSchema instanceof TSSchema ? [this.elementSchema.node] : [];
  }
}

export class DictionarySchema extends Primitive {
  constructor(public elementSchema: Schema, initializer?: Partial<DictionarySchema>) {
    super('dictionary');
    this.initialize(initializer);
  }
  get typeDefinition(): string {
    return `Dictionary<${this.elementSchema.typeDefinition}>`;
  }
  get requiredTypeDeclarations(): Array<TypeDeclaration> {
    return this.elementSchema instanceof TSSchema ? [this.elementSchema.node] : [];
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


export class UnixTimePrimitive extends Primitive {
  constructor(initializer?: Partial<UnixTimePrimitive>) {
    super('unixtime');
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
