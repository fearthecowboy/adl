import { v2, v3, XMSEnumValue } from '@azure-tools/openapi';
import { anonymous, nameOf } from '@azure-tools/sourcemap';
import { createAlias } from '../../../model/schema/alias';
import { NullableModifier, ReadOnlyModifier } from '../../../model/schema/constraint';
import { ServerDefaultValue } from '../../../model/schema/default';
import { createEnum } from '../../../model/schema/enum';
import { Schema } from '../../../model/schema/schema';
import { Context, OAIModel } from '../../../support/visitor';


export const arrayProperties = <Array<keyof v2.Schema&v3.Schema>>['maxItems', 'minItems', 'uniqueItems'];
export const numberProperties = <Array<keyof v2.Schema & v3.Schema>>['multipleOf', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum',];
export const stringProperties = <Array<keyof v2.Schema & v3.Schema>>['maxLength', 'minLength', 'pattern',];
export const objectProperties = <Array<keyof v2.Schema & v3.Schema>>['properties', 'discriminator', 'additionalProperties', 'minProperties', 'maxProperties'];
export const notPrimitiveProperties = <Array<keyof v2.Schema & v3.Schema>>[...stringProperties, ...objectProperties, ...arrayProperties, ...numberProperties];
export const notObject = [...arrayProperties, ...numberProperties, ...stringProperties];

/** Schema processing options */
export type Options = Partial<{
  /** this is an inline-declared anonymous schema; the name is not intended to be used as the final name */
  isAnonymous: boolean;

  /** processes the schema just as the target type, and not oneOf/allOf/anyOf/object/enum */
  justTargetType: boolean;

  /** note that this is a property declaration while processing this schema */
  isProperty: boolean;

  /** note that this is a parameter declaration while processing this schema */
  isParameter: boolean;
}>;

export function commonProperties(schema: v3.Schema|v2.Schema) {
  return {
    description: schema.description,
    summary: schema.title,
    clientName: (<any>schema)['x-ms-client-name'],

    // todo: I'm not fond of having this in schema -- we should strongly consider refactoring this so the consumer gets it (ie, the property)
    nullable: (<any>schema).nullable || schema['x-nullable']
  };
}

export async function* processCharSchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.Char, $);
}

export async function* processDateSchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.Date, $);
}

export async function* processTimeSchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.Time, $);
}

export async function* processDateTimeSchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.DateTime, $);
}

export async function* processDurationSchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.Duration, $);
}

export async function* processUuidSchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.Uuid, $);
}

export async function* processUriSchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.Uri, $);
}

export async function* processPasswordSchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.Password, $);
}

export async function* processOdataSchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.OData, $);
}

export async function* processBooleanSchema<T extends OAIModel>(schema: v3.Schema | v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>notPrimitiveProperties)) {
    return;
  }

  return yield addAliasWithDefault(schema, $.api.schemas.Boolean, $);
}

export async function* processByteArraySchema<T extends OAIModel>(schema: v3.Schema | v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...<any>stringProperties, ...<any>objectProperties, ...<any>numberProperties)) {
    return;
  }

  yield $.api.schemas.ByteArray;
}

export function addAliasWithDefault<T extends OAIModel>(schema: v3.Schema | v2.Schema, resultSchema: Schema, $: Context<T>) {
  if (schema.default || schema.description || schema.title || (<any>schema).nullable || schema['x-nullable'] || (<any>schema).readOnly) {
    const alias = createAlias($.api, anonymous(resultSchema.name), resultSchema, commonProperties(schema));
    if (schema.default) {
      alias.defaults.push(new ServerDefaultValue(schema.default));
    }

    if ((<any>schema).readOnly) {
      alias.constraints.push(new ReadOnlyModifier());
    }

    if ((<any>schema).nullable || schema['x-nullable'] ) {
      alias.constraints.push(new NullableModifier((<any>schema).readOnly));
    }
    return alias;
  }
  return resultSchema;
}


export async function* processFileSchema<T extends OAIModel>(schema: v3.Schema | v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  return yield $.api.schemas.File;
}

export async function* processAnySchema<T extends OAIModel>(schema: v3.Schema|v2.Schema, $: Context<T>): AsyncGenerator<Schema> {
  return yield $.api.schemas.Any;
}

export async function* processEnumSchema<T extends OAIModel>(schema: v3.Schema | v2.Schema, $: Context<T>, options?: Options): AsyncGenerator<Schema> {
  const schemaEnum = schema.enum || [];
  const xmsEnum = schema['x-ms-enum'] || {};
  const values: Array<XMSEnumValue> = xmsEnum.values|| schemaEnum.map(value => ({ value }));
  const name = xmsEnum.name || (options?.isAnonymous ? anonymous('enum') : nameOf(schema));
  const extensible = xmsEnum.modelAsString;

  yield createEnum($.api, name, values, { 
    extensible, 
    ...commonProperties(schema) 
  });
}