import { length, values } from '@azure-tools/linq';
import { common, isReference, v2 } from '@azure-tools/openapi';
import { JsonReference, ParameterLocation } from '@azure-tools/openapi/dist/v2';
import { anonymous, nameOf } from '@azure-tools/sourcemap';
import { createOperation, Method, Operation, Path } from '../../../model/http/operation';
import { Request } from '../../../model/http/request';
import { addExtensionsToAttic, push } from '../common';
import { processExternalDocs } from '../common/info';
import { getGroupAndName } from '../common/path';
import { requestBody } from './body-parameter';
import { parameter } from './parameter';
import { response } from './response';
import { Context } from './serializer';

export async function* path(pathItem: v2.PathItem, $: Context, options?: { isAnonymous?: boolean }): AsyncGenerator<Operation> {
  const path = nameOf(pathItem);
  for (const method of values(common.HttpMethod)) {
    if (method in pathItem) {
      yield* operation({method: <Method><unknown>method, path}, pathItem[<common.HttpMethod>method], pathItem, $);
    }
  }
  addExtensionsToAttic($.api.http, pathItem);
}

export async function* operation(path: Path, operation: v2.Operation, shared: v2.PathItem, $: Context): AsyncGenerator<Operation> {
  const [group, name] = getGroupAndName(operation, path.path);

  const result = createOperation(
    $.api,
    path,
    group,
    name, {
      description: operation.description,
      summary: operation.summary,
    });

  if (operation.tags) {
    result.tags.push(...operation.tags);
  }

  // push to the attic for now
  result.addToAttic('security', operation.security);

  result.addToAttic('x-ms-examples', operation['x-ms-examples']);
  result.addToAttic('x-ms-pageable', operation['x-ms-pageable']);
  result.addToAttic('x-ms-long-running-operation-options', operation['x-ms-long-running-operation-options']);
  result.addToAttic('x-ms-long-running-operation', operation['x-ms-long-running-operation']);

  // since we're not going thru $.process
  $.addVersionInfo(result, operation);

  // OAI2 parameters are all in the operation
  for (const p of values(shared.parameters)) {
    if (isReference(p)) {
      const r = await $.resolveReference(p.$ref);
      if (r.in == ParameterLocation.Body || r.in == ParameterLocation.FormData) {
        push(result.requests, $.processInline(requestBody, <JsonReference<v2.BodyParameter>> p, { isAnonymous: true, operation }));
        continue;
      }
    } else if (p.in == ParameterLocation.Body || p.in == ParameterLocation.FormData )  {
      push(result.requests, $.processInline(requestBody, <v2.BodyParameter>p, { isAnonymous: true, operation}));
      continue;
    }

    // create each parameter in the operation  (non-body)
    await push(result.parameters, $.processInline(parameter, p));
  }

  const consumes = operation?.consumes || $.sourceModel.consumes || [];
  if( length( consumes) > 0  && operation.parameters?.find(each =>(<any>each).in === ParameterLocation.Body) === undefined )   {
    // they specified a body content type, but no actual body parameter, which means
    // they get an anonymous one added 
    for( const mediaType of consumes ) {
      result.requests.push( new Request(anonymous('requestBody'),mediaType,$.api.schemas.File));
    }
  }

  for (const p of values(operation.parameters)) {
    // create each parameter in the operation 
    if (isReference(p)) {
      const r = await $.resolveReference(p.$ref);
      if (r.in == ParameterLocation.Body) {
        push(result.requests, $.processInline(requestBody, <JsonReference<v2.BodyParameter>>p, { isAnonymous: true, operation }));
        continue;
      }
    } else if (p.in == ParameterLocation.Body) {
      push(result.requests, $.processInline(requestBody, <v2.BodyParameter>p, { isAnonymous: true, operation }));
      continue;
    }

    // create each parameter in the operation  (non-body)
    await push(result.parameters, $.processInline(parameter, p, {isAnonymous: true}));
  }

  for await (const rsp of $.processDictionary(response, <any>operation.responses, {operation})) {
    result.responses.push(rsp);
  }
  // pick up external docs
  for await (const reference of processExternalDocs(operation.externalDocs, $)) {
    result.references.push(reference);
  }

  yield addExtensionsToAttic(result, operation);
}