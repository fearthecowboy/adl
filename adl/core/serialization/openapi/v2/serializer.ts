import { items } from '@azure-tools/linq';
import { Dictionary, isReference, JsonReference, v2, vendorExtensions } from '@azure-tools/openapi';
import { isVendorExtension, ParameterLocation } from '@azure-tools/openapi/dist/v2';
import { Alias as GenericAlias } from '../../../model/alias';
import { ApiModel } from '../../../model/api-model';
import { Alias, createAlias } from '../../../model/schema/alias';
import { Constant } from '../../../model/schema/constant';
import { Enum } from '../../../model/schema/enum';
import { AndSchema, AnyOfSchema, XorSchema } from '../../../model/schema/group';
import { ObjectSchemaImpl } from '../../../model/schema/object';
import { AnySchema, ArraySchema, Primitive } from '../../../model/schema/primitive';
import { Host } from '../../../support/file-system';
import { Context as Ctx, Visitor } from '../../../support/visitor';
import { push, singleOrDefault } from '../common';
import { processExternalDocs, processInfo, processTag } from '../common/info';
import { requestBody } from './body-parameter';
import { parameter } from './parameter';
import { path } from './path';
import { processSchema } from './schema';
import { authentication, authenticationRequirement } from './security';
import { processServers } from './server';


// node types that are objects
export type Context = Ctx<v2.Model>;

// node types that are objects or references
export type ItemsOf<T> = Dictionary<T | JsonReference<T>>;

export async function deserializeOpenAPI2(host: Host, ...inputs: Array<string>) {
  const output = await new Visitor<v2.Model>(new ApiModel(), host, 'oai2', ...inputs).process(processRoot);

  return output;
}

async function processRoot(oai2: v2.Model, $: Context) {

  const extensions = vendorExtensions(oai2);

  for (const [key] of extensions) {
    switch (key) {
      case 'x-ms-metadata':

        break;
      default:
        // record unknown extensions at model level
        break;
    }
  }
  
  $.api.metaData = await singleOrDefault($.process(processInfo, oai2.info)) || $.api.metaData;

  // external docs are just a kind of reference
  for await (const reference of $.process(processExternalDocs, oai2.externalDocs)) {
    $.api.metaData.references.push(reference);
  }

  for await (const reference of $.processArray(processTag, oai2.tags)) {
    $.api.metaData.references.push(reference);
  }

  for await (const server of $.process(processServers, oai2)) {
    $.api.http.connections.push(server);
  }

  for await (const auth of $.processDictionary(authentication, oai2.securityDefinitions)) {
    $.api.http.authentications.push(auth);
  }

  for await (const requirement of $.processArray(authenticationRequirement, oai2.security)) {
    $.api.http.authenticationRequirements.push(requirement);
  }

  // definitely, schemas first, since so much will $ref them
  // await consume($.process(processSchemas, components.schemas));
  for await (const schema of $.processDictionary(processSchema, oai2.definitions)) {
    // we have to split up where schemas go 
    if (schema instanceof GenericAlias) {
      // this happens when we get a top-level alias 
      // just sub in a schema alias for it
      $.api.schemas.aliases.push(createAlias($.api,schema.name,schema.target));
      continue;
    }
    if (schema instanceof Alias) {
      $.api.schemas.aliases.push(schema);
      continue;
    }
    if (schema instanceof ObjectSchemaImpl) {
      $.api.schemas.objects.push(schema);
      continue;
    }
    if (schema.type === 'enum' ) {
      $.api.schemas.enums.push(<Enum>schema);
      continue;
    }
    if (schema instanceof Constant) {
      $.api.schemas.constants.push(schema);
      continue;
    }
    if (schema instanceof AndSchema || schema instanceof XorSchema || schema instanceof AnyOfSchema) {
      $.api.schemas.combinations.push(schema);
      continue;
    }
    if (schema instanceof AnySchema || schema instanceof ArraySchema || schema instanceof Primitive) {
      continue;
    }

    throw new Error(`Should not get here. '${schema.name}' is of type ${Object.getPrototypeOf(schema).name}`);
  }


  for (const [key, value] of items(oai2.parameters)) {
    if (isVendorExtension(key)) {
      continue;
    }

    if (isReference(value)) {
      const r = await $.resolveReference(value.$ref);
      if (r.in == ParameterLocation.Body) {
        push($.api.http.requests, $.processInline(requestBody, <JsonReference<v2.BodyParameter>>value ));
        continue;
      }

      push($.api.http.parameters, $.processInline(parameter, value));
      continue;
    } else if (value.in == ParameterLocation.Body) {
      push($.api.http.requests, $.processInline(requestBody, <v2.BodyParameter>value));
      continue;
    }
    push($.api.http.parameters, $.process(parameter, value));
  }

  
  for await (const operation of $.processDictionary(path, oai2.paths)) {
    $.api.http.operations.push(operation);
  }
  for await (const operation of $.processDictionary(path, oai2['x-ms-paths'])) {
    $.api.http.operations.push(operation);
  }

  return $.api;
}

