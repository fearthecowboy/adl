import { values } from '@azure-tools/linq';
import { common, v3 } from '@azure-tools/openapi';
import { nameOf } from '@azure-tools/sourcemap';
import { createOperation, Operation, Path, Method } from '../../../model/http/operation';
import { addExtensionsToAttic, push } from '../common';
import { processExternalDocs } from '../common/info';
import { getGroupAndName } from '../common/path';
import { parameter } from './parameter';
import { requestBody } from './request-body';
import { response } from './response';
import { authenticationRequirement } from './security';
import { Context } from './serializer';
import { processServer } from './server';

export async function* path(pathItem: v3.PathItem, $: Context, options?: { isAnonymous?: boolean }): AsyncGenerator<Operation> {
  const path = nameOf(pathItem);
  for (const method of values(common.HttpMethod)) {
    if (method in pathItem) {
      yield* operation({method: <Method><unknown>method, path}, pathItem[<common.HttpMethod>method], pathItem, $);
    }
  }
  addExtensionsToAttic($.api.http, pathItem);
}


export async function* operation(path: Path, operation: v3.Operation, shared: v3.PathItemBase, $: Context): AsyncGenerator<Operation> {
  const [group, name] = getGroupAndName(operation, path.path);

  const result = createOperation(
    $.api,
    path,
    group,
    name, {
      description: operation.description || shared.description,
      summary: operation.summary || shared.summary,
    });
  
  if (operation.tags) {
    result.tags.push(...operation.tags);
  }

  for await (const requirement of $.processArray(authenticationRequirement, operation.security)) {
    result.authenticationRequirements.push(requirement);
  }

  for await (const server of $.processArray(processServer, operation.servers)) {
    result.connections.push(server);
  }

  // since we're not going thru $.process
  $.addVersionInfo(result, operation);

  // OAI3 parameters are all in the operation
  for (const p of values(shared.parameters)) {
    // create each parameter in the operation 
    await push(result.parameters, $.processInline(parameter, p));
  }

  for (const p of values(operation.parameters)) {
    // create each parameter in the operation 
    await push(result.parameters, $.processInline(parameter, p));
  }

  // request body
  for await (const request of $.processInline(requestBody, operation.requestBody, { isAnonymous: true })) {
    // each request body.
    result.requests.push(request);
  }

  for await (const rsp of $.processDictionary(response, <any>operation.responses)) {
    result.responses.push(rsp);
  }
  // pick up external docs
  for await (const reference of processExternalDocs(operation.externalDocs, $)) {
    result.references.push(reference);
  }

  yield addExtensionsToAttic(result, operation);
}