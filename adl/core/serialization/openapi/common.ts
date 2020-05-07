import { length } from '@azure-tools/linq';
import { common, StringFormat, v2, v3, vendorExtensions } from '@azure-tools/openapi';
import { use, valueOf } from '@azure-tools/sourcemap';
import { Element } from '../../model/element';

export async function toArray<T>(g: AsyncGenerator<T>) {
  const result = new Array<T>();
  for await (const each of g) {
    result.push(each);
  }
  return result;
}

export async function consume<T>(g: AsyncGenerator<T>) {
  for await (const each of g) {
    // just consume it.
  }
}

export function isObjectSchema(schema: v3.Schema) {
  return schema.type == common.JsonType.Object ||
    length(schema.properties) > 0 ||
    schema.discriminator ||
    (<any>schema)['x-ms-discriminator-value'] ||
    schema.additionalProperties !== undefined ||
    schema.maxProperties !== undefined ||
    schema.minProperties !== undefined;
}

export function isPrimitiveSchema(schema: v3.Schema | v2.Schema) {
  switch (valueOf(schema.type)) {
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

export function isEnumSchema(schema: v3.Schema) {
  return (schema.enum || schema['x-ms-enum']);
}


export function addExtensionsToAttic<T extends Element>(element: T, input: any) {
  for (const { key, value } of vendorExtensions(input)) {
    element.addToAttic(key, use(value, true));
  }
  return element;
}