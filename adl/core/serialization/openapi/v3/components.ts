import { v3 } from '@azure-tools/openapi';
import { Alias as GenericAlias } from '../../../model/alias';
import { Element } from '../../../model/element';
import { Alias, AndSchema, AnyOfSchema, AnySchema, ArraySchema, Constant, Enum, ObjectSchema, Primitive, XorSchema } from '../../../model/schema';
import { header } from './header';
import { parameter } from './parameter';
import { requestBody } from './request-body';
import { response } from './response';
import { processSchema } from './schema';
import { securityScheme } from './security-schemes';
import { Context } from './serializer';

const { vendorExtensions } = v3;


// eslint-disable-next-line require-yield
export async function* processComponents(components: v3.Components, $: Context): AsyncGenerator<Element> {

  for (const [key, extension] of vendorExtensions(components)) {
    // switch(key)

  }

  // definitely, schemas first, since so much will $ref them
  // await consume($.process(processSchemas, components.schemas));
  for await (const schema of $.processDictionary(processSchema, components.schemas)) {
    // we have to split up where schemas go 
    if (schema instanceof GenericAlias) {
      throw new Error('schemas have their own alias type');
    }
    if (schema instanceof Alias) {
      $.api.schemas.aliases.push(schema);
      continue;
    }
    if (schema instanceof ObjectSchema) {
      $.api.schemas.objects.push(schema);
      continue;
    }
    if (schema instanceof Enum) {
      $.api.schemas.enums.push(schema);
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

    throw new Error('Should not get here.');
  }

  // if there are vendor extensions in the dictionary, they should be handled like this:
  // for (const { key, value: extension } of vendorExtensions(components.headers)) {
  // ... do something ...
  // }
  for await (const h of $.processDictionary(header, components.headers)) {
    $.api.http.headers.push(h);
  }

  for await (const p of $.processDictionary(parameter, components.parameters)) {
    $.api.http.parameters.push(p);
  }

  for await (const request of $.processDictionary(requestBody, components.requestBodies)) {
    $.api.http.requests.push(request);
  }

  for await (const rsp of $.processDictionary(response, components.responses)) {
    $.api.http.responses.push(rsp);
  }

  for await (const auth of $.processDictionary(securityScheme, components.securitySchemes)) {
    $.api.http.authentications.push(auth);
  }


  // await $.process(processExamples, components.examples); // send to attic 
  // await $.process(processCallbacks, components.callbacks);  // ok skip
  // await $.process(processLinks, components.links); // ok skip


  return undefined;
}