import { items, length, values } from '@azure-tools/linq';
import { IntegerFormat, NumberFormat, StringFormat, v2 } from '@azure-tools/openapi';
import { anonymous, nameOf, using } from '@azure-tools/sourcemap';
import { Alias as GenericAlias } from '../../../model/alias';
import { createAlias } from '../../../model/schema/alias';
import { ExclusiveMaximumConstraint, ExclusiveMinimumConstraint, MaximumConstraint, MaximumElementsConstraint, MaximumPropertiesConstraint, MaxLengthConstraint, MinimumConstraint, MinimumElementsConstraint, MinimumPropertiesConstraint, MinLengthConstraint, MultipleOfConstraint, ReadOnlyModifier, RegularExpressionConstraint, UniqueElementsConstraint } from '../../../model/schema/constraint';
import { ServerDefaultValue } from '../../../model/schema/default';
import { createObjectSchema } from '../../../model/schema/object';
import { ArraySchema, DictionarySchema } from '../../../model/schema/primitive';
import { Schema } from '../../../model/schema/schema';
import { Identity } from '../../../model/types';
import { isEnumSchema, isObjectSchema, singleOrDefault } from '../common';
import { arrayProperties, commonProperties, numberProperties, objectProperties, Options, processAnySchema, processBooleanSchema, processByteArraySchema, processCharSchema, processDateSchema, processDateTimeSchema, processDurationSchema, processEnumSchema, processFileSchema, processOdataSchema, processPasswordSchema, processTimeSchema, processUriSchema, processUuidSchema, stringProperties } from '../common/schema';
import { Context } from './serializer';

export async function* processInline(schema: v2.Schema | v2.SchemaReference | undefined, $: Context, options?: Options): AsyncGenerator<Schema> {
  if (schema) {
    for await (const result of $.processInline(processSchema, schema, options)) {
      if (result) {
        if (options?.isAnonymous) {
          // if this was anonymous, we just want back the target object 
          yield result instanceof GenericAlias ? result.target : result;
        } else {
          yield result instanceof GenericAlias ? createAlias($.api, result.name, result.target, commonProperties(<any>schema)) : result;
        }
      }
    }
  }
}

async function* getSchemas(schemas: Array<v2.Schema | v2.SchemaReference> | undefined, $: Context): AsyncGenerator<Schema> {
  for (const each of values(schemas)) {
    for await (const schema of $.processInline(processSchema, each, { isAnonymous: true })) {
      yield schema instanceof GenericAlias ? schema.target : schema;
    }
  }
}

// eslint-disable-next-line require-yield
export async function* processSillyRef(schema: v2.Schema, $: Context, options?: { isAnonymous?: boolean }): AsyncGenerator<Schema> {
  throw new Error('TODO: process silly references');

}

export async function* processSchema(schema: v2.Schema, $: Context, options?: { isAnonymous?: boolean }): AsyncGenerator<Schema> {
  
  const impl = () => {
    // if enum or x-ms-enum is specified, process as enum
    if (isEnumSchema(schema)) {
      return processEnumSchema(schema, $, options);
    }

  
    if (length(schema.allOf) > 0) {
      // this could be composition
      //  
      // or a back-door way to $ref 
      if (length(schema.allOf) === 1) {
        // if (!schema.properties) {
        // no properties, but inheritance,
        // return processSillyRef(schema, $, options);
        // }
      }
      // process schemas with allOf as objects 
      return processObjectSchema(schema, $, options);
    }

    switch (schema.type) {
      case v2.JsonType.String:
        return processStringSchema(schema, $);

      case v2.JsonType.Boolean:
        return processBooleanSchema(schema, $);

      case v2.JsonType.Array:
        return processArraySchema(schema, $);

      case v2.JsonType.Number:
        return processNumberSchema(schema, $);

      case v2.JsonType.Integer:
        return processIntegerSchema(schema, $);

      case v2.JsonType.File:
        return processFileSchema(schema, $);

      case v2.JsonType.Object:
        return processObjectSchema(schema, $, options);

      case undefined:
        // dig deeper to figure out what this should be.

        // first, let's see if we can tell by format:
        switch (schema.format) {
          // is it some kind of binary response?
          case StringFormat.Binary:
          case StringFormat.File:
            return processFileSchema(schema, $);
        }

        if (isObjectSchema(schema)) {
          // talk about properties or discriminator, pretty much mean object
          return processObjectSchema(schema, $, options);
        }

        if (schema.items || schema.maxItems !== undefined || schema.uniqueItems) {
          // these only apply to arrays
          return processArraySchema(schema, $);
        }

        if (schema.pattern || schema.maxLength !== undefined || schema.minLength !== undefined) {
          // these only apply to strings
          return processStringSchema(schema, $);
        }

        if (schema.minimum !== undefined || schema.maximum !== undefined || schema.exclusiveMaximum !== undefined || schema.exclusiveMinimum !== undefined || schema.multipleOf !== undefined) {
          // these only apply to numbers
          return processNumberSchema(schema, $);
        }
        break;
    }
    // if we didn't catch what it could be, they could be aiming for 'any' (grrrrr)
    return processAnySchema(schema, $);
  };
  for await (const result of impl()) {
    if (result && schema.example) {
      result.addToAttic('example', schema.example);
    }
    yield result;
  }
}

export async function* processStringSchema(schema: v2.Schema, $: Context): AsyncGenerator<Schema> {
  switch (schema.format) {
    case StringFormat.Base64Url:
    case StringFormat.Byte:
    case StringFormat.Binary:
      return yield* processByteArraySchema(schema, $);

    case StringFormat.Char:
      return yield* processCharSchema(schema, $);

    case StringFormat.Date:
      return yield* processDateSchema(schema, $);

    case StringFormat.Time:
      return yield* processTimeSchema(schema, $);

    case StringFormat.DateTime:
    case StringFormat.DateTimeRfc1123:
      return yield* processDateTimeSchema(schema, $);

    case StringFormat.Duration:
      return yield* processDurationSchema(schema, $);

    case StringFormat.Uuid:
      return yield* processUuidSchema(schema, $);

    case StringFormat.Url:
    case StringFormat.Uri:
      return yield* processUriSchema(schema, $);

    case StringFormat.Password:
      return yield* processPasswordSchema(schema, $);

    case StringFormat.OData:
      return yield* processOdataSchema(schema, $);
  }

  if ($.forbiddenProperties(schema, ...objectProperties, ...arrayProperties, ...numberProperties)) {
    return;
  }

  // we're going to treat it as a standard string schema
  // if this is just a plain string with no adornments, just return the common string instance. 
  if (!(schema.default !== undefined || schema.readOnly !== undefined || schema.minLength !== undefined || schema.maxLength !== undefined || schema.pattern !== undefined)) {
    return yield $.api.schemas.String;
  }
  
  // otherwise, we have to get the standard string and make an alias for it with the adornments. 
  const alias = createAlias($.api,anonymous('string'), $.api.schemas.String, commonProperties(schema));

  if (schema.default !== undefined) {
    alias.defaults.push(new ServerDefaultValue(schema.default));
  }

  if (schema.readOnly !== undefined) {
    alias.constraints.push(new ReadOnlyModifier());
  }

  if (schema.maxLength !== undefined) {
    alias.constraints.push(new MaxLengthConstraint(schema.maxLength));
  }

  if (schema.minLength !== undefined) {
    alias.constraints.push(new MinLengthConstraint(schema.minLength));
  }

  if (schema.pattern !== undefined) {
    alias.constraints.push(new RegularExpressionConstraint(schema.pattern));
  }

  // we'll have to come back to xml
  alias.addToAttic('xml', schema.xml);


  yield alias;
}


export async function* processIntegerSchema(schema: v2.Schema, $: Context): AsyncGenerator<Schema> {
  if ($.forbiddenProperties(schema, ...stringProperties, ...objectProperties, ...arrayProperties)) {
    return;
  }

  let result: Schema;

  switch (schema.format) {
    case IntegerFormat.Int32:
      result = $.api.schemas.Int32;
      break;

    case undefined:
    case IntegerFormat.Int64:
      result = $.api.schemas.Int64;
      break;

    case IntegerFormat.UnixTime:
      result = $.api.schemas.Time;
      break;


    default:
      throw new Error(`Unexpected integer format: ${schema.format}`);
  }

  yield constrainNumericSchema(schema, $, result);
}

export async function* processNumberSchema(schema: v2.Schema, $: Context): AsyncGenerator<Schema> {

  if ($.forbiddenProperties(schema, ...stringProperties, ...objectProperties, ...arrayProperties)) {
    return;
  }

  let result: Schema;

  switch (schema.format) {
    case NumberFormat.Float:
      result = $.api.schemas.Float;
      break;

    case undefined:
    case NumberFormat.Double:
      result = $.api.schemas.Double;
      break;

    default:
      throw new Error(`Unexpected number format: ${schema.format}`);
  }

  yield constrainNumericSchema(schema, $, result);
}

function constrainNumericSchema(schema: v2.Schema, $: Context, target: Schema): Schema {
  // if this is just a number with no adornments, just return the common instance
  if (!(schema.default !== undefined || schema.exclusiveMaximum !== undefined || schema.exclusiveMinimum !== undefined || schema.minimum !== undefined || schema.maximum !== undefined || schema.multipleOf)) {
    return target;
  }

  // gonna need an alias
  const alias = createAlias($.api,anonymous('number'), target, commonProperties(schema));

  if (schema.default) {
    alias.defaults.push(new ServerDefaultValue(schema.default));
  }

  if (schema.minimum !== undefined ) {
    if (schema.exclusiveMinimum) {
      alias.constraints.push(new ExclusiveMinimumConstraint(schema.minimum));
    } else {
      alias.constraints.push(new MinimumConstraint(schema.minimum));
    }
  }
  if (schema.maximum !== undefined ) {
    if (schema.exclusiveMaximum) {
      alias.constraints.push(new ExclusiveMaximumConstraint(schema.maximum));
    } else { 
      alias.constraints.push(new MaximumConstraint(schema.maximum));
    }
  }
  if (schema.multipleOf !== undefined ) {
    alias.constraints.push(new MultipleOfConstraint(schema.multipleOf));
  }

  // we'll have to come back to xml
  alias.addToAttic('xml', schema.xml);

  return alias;
}


export async function* processArraySchema(schema: v2.Schema, $: Context, options?: Options): AsyncGenerator<Schema> {
  const schemaName = <Identity>(options?.isAnonymous ? anonymous('array') : nameOf(schema));
  // if this isn't anonymous or a property or parameter, things like descriptions belong to this declaration
  const common = (!options?.isAnonymous && !options?.isParameter && !options?.isProperty) ? commonProperties(schema) : {};


  const elementSchema = await singleOrDefault(processInline(schema.items, $, { isAnonymous: true })) || $.api.schemas.Any;

  if ($.forbiddenProperties(schema, ...stringProperties, ...numberProperties)) {
    return undefined;
  }

  const result = new ArraySchema(elementSchema);

  if (!(schema.default !== undefined || schema.maxItems !== undefined || schema.minItems !== undefined || schema.uniqueItems !== undefined)) {
    return yield result;
  }

  const alias = createAlias($.api,anonymous('array'), result, {
    name: schemaName,
    ...common
  });

  if (schema.default) {
    alias.defaults.push(new ServerDefaultValue(schema.default));
  }

  if (schema.readOnly) {
    alias.constraints.push(new ReadOnlyModifier());
  }
  if (schema.maxItems !== undefined) {
    alias.constraints.push(new MaximumElementsConstraint(schema.maxItems));
  }
  if (schema.minItems !== undefined) {
    alias.constraints.push(new MinimumElementsConstraint(schema.minItems));
  }
  if (schema.uniqueItems !== undefined) {
    alias.constraints.push(new UniqueElementsConstraint(schema.uniqueItems));
  }

  // we'll have to come back to xml
  alias.addToAttic('xml', schema.xml);


  return yield alias;
}

export async function* processAdditionalProperties(schema: v2.Schema, $: Context, options?: Options): AsyncGenerator<Schema> {
  if (!schema.additionalProperties) {
    throw new Error('should not get here.');
  }

  const schemaName = options?.isAnonymous ? anonymous('dictionary') : nameOf(schema);

  const common = schema.properties ? {} : commonProperties(schema);

  // true means type == any
  const dictionaryType = schema.additionalProperties != true ? await singleOrDefault(processInline(schema.additionalProperties, $, { isAnonymous: true })) || $.api.schemas.Any : $.api.schemas.Any;

  if (length(common) > 0 || schema.maxProperties !== undefined || schema.minProperties !== undefined) {
    const result = new DictionarySchema(dictionaryType);

    const alias = createAlias($.api,anonymous('dictionary'), result, {
      name: schemaName,
      ...common
    });

    if (schema.maxProperties !== undefined) {
      alias.constraints.push(new MaximumPropertiesConstraint(schema.maxProperties));
    }
    if (schema.minProperties !== undefined) {
      alias.constraints.push(new MinimumPropertiesConstraint(schema.minProperties));
    }
    if (schema.readOnly) {
      alias.constraints.push(new ReadOnlyModifier());
    }
    if (schema.default) {
      alias.defaults.push(new ServerDefaultValue(schema.default));
    }

    // we'll have to come back to xml
    alias.addToAttic('xml', schema.xml);

    return yield alias;
  }

  // just a dictionary without constraints
  const result = new DictionarySchema(dictionaryType, {
    name: schemaName,
    ...common
  });

  yield result;
}


export async function* processObjectSchema(schema: v2.Schema, $: Context, options?: Options): AsyncGenerator<Schema> {

  if (schema.additionalProperties && length(schema.properties) === 0 && length(schema.allOf) === 0) {
    // if it has no actual properties of it's own, but it has additionalProperties, return just the dictionary
    // as the type.
    return yield* await processAdditionalProperties(schema, $, options);
  }
  const schemaName = options?.isAnonymous ? anonymous('object') : nameOf(schema);

  // creating an object schema 
  const result = createObjectSchema($.api, schemaName, commonProperties(schema));

  result.addToAttic('example', (<any>schema).example);
  
  // we'll have to come back to xml
  result.addToAttic('xml', schema.xml);
  result.addToAttic('x-ms-azure-resource', schema['x-ms-azure-resource']);
  result.addToAttic('x-ms-external', schema['x-ms-external']);

  const schemas = getSchemas(schema.allOf, $);
  // await push(result.extends, schemas);
  for await ( const schema of schemas) {
    const s= <any>schema;
    if( s.node) {
      result.parents.push(s);
    }
  }

  // yeild this as soon as possible in case we recurse.
  yield result;

  // process the properties
  for (const [propertyName, property] of items(schema.properties)) {
    // process schema/reference inline
    const propSchema = await singleOrDefault(processInline(property, $, { isAnonymous: true })) || $.api.schemas.Any;

    // grabs the 'required' value for the property
    let required = undefined;

    if (schema.required) {
      const i = schema.required.indexOf(propertyName);
      required = using(schema.required[i], true);
    }

    const p = result.createProperty(propertyName, propSchema, {
      required,
      // in OAI2, we've historically allowed description, readonly (and a few other things)
      // on a property, even if it's a reference
      description: (<any>property).description,
      readonly: (<any>property).readOnly,
      clientName: (<any>property)['x-ms-client-name']
    });
    
    p.addToAttic('example', (<any>property).example);
    p.addToAttic('x-ms-client-flatten', (<any>property)['x-ms-client-flatten']);
    $.addVersionInfo(p, property);
    // result.properties.push(p);
    //result.properties.add(p);
  }

  if (schema.additionalProperties) {
    // if additionalProperties is specified, then the type should
    // be extending the dictionary of <type> 
    for await (const ds of processAdditionalProperties(schema, $, { isAnonymous: true })) {
      // result.extends.push(await ds);
    }
  }
}

