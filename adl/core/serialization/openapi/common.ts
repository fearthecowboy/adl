import { length } from '@azure-tools/linq';
import { common, StringFormat, v2, v3, vendorExtensions } from '@azure-tools/openapi';
import { Element } from '../../model/element';
import { Collection } from '../../model/types';

export async function toArray<T>(g: AsyncGenerator<T>) {
  const result = new Array<T>();
  for await (const each of g) {
    result.push(each);
  }
  return result;
}

export async function push<T>(destination: Array<T> | Collection<T>, g: AsyncGenerator<T>) {
  for await (const each of g) {
    destination.push(each);
  }
  return destination;
}

export async function consume<T>(g: AsyncGenerator<T>) {
  for await (const each of g) {
    // just consume it.
  }
}

export async function singleOrDefault<T>(generator: AsyncGenerator<T>): Promise<T | undefined> {
  let result: T | undefined;
  for await (const each of generator) {
    if (result === undefined) {
      result = each;
      continue;
    }
    throw new Error('Sequence contains more than one element.');
  }
  return result;
}

export async function single<T>(generator: AsyncGenerator<T>): Promise<T> {
  const result = await singleOrDefault(generator);
  if (result === undefined) {
    throw new Error('Sequence contains no elements.');
  }
  return result;
}

export function isObjectSchema(schema: v3.Schema| v2.Schema) {
  return schema.type == common.JsonType.Object ||
    length(<any>schema.properties) > 0 ||
    schema.discriminator ||
    (<any>schema)['x-ms-discriminator-value'] ||
    schema.additionalProperties !== undefined ||
    schema.maxProperties !== undefined ||
    schema.minProperties !== undefined;
}

export function isPrimitiveSchema(schema: v3.Schema | v2.Schema) {
  switch (schema.type) {
    case common.JsonType.String:
      // file format generally means a blob body
      if (schema.format == StringFormat.File) {
        return false;
      }
      // fallthrough
    case common.JsonType.Number:
    case common.JsonType.Integer:
    case common.JsonType.Boolean:
    case common.JsonType.Array:
      return true;
  }

  return false;
}
 
export function isEnumSchema(schema: v3.Schema | v2.Schema) {
  return (schema.enum || schema['x-ms-enum']);
}


export function addExtensionsToAttic<T extends Element>(element: T, input: any) {
  for (const [ key, value] of vendorExtensions(input)) {
    element.addToAttic(key, value);
  }
  return element;
}

