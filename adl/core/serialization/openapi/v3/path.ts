import { items, values } from '@azure-tools/linq';
import { common, isReference, v3 } from '@azure-tools/openapi';
import { nameOf } from '@azure-tools/sourcemap';
import { createOperationGroup, createOperationStructure, Method, OperationStructure, Path } from '../../../model/http/operation';
import { ParameterTypeReference, ResponseTypeReference } from '../../../model/schema/type';
import { getGroupAndName } from '../common/path';
import { versionInfo } from '../common/schema';
import { processParameter } from './parameter';
import { processRequestBody } from './request-body';
import { processResponse } from './response';
import { Context } from './serializer';

export async function processPaths(pathLists: Array<v3.Paths>, $: Context) {
  const map = new Map<string, Array<OperationStructure>>();
  for (const pathList of pathLists) {
    for (let [, path] of items(pathList)) {
      if (isReference(path)) {
        path = <v3.PathItem>((await $.resolveReference(path.$ref)).node);
      }
      for await (const operation of processPath(path, $)) {
        let operations = map.get(operation.group);
        if (!operations) {
          operations = new Array<OperationStructure>();
          map.set(operation.group, operations);
        }
        operations.push(operation);
      }
    }
  }

  for (const [group, structures] of items(map)) {
    createOperationGroup($.api, group, structures);
  }
}

export async function* processPath(pathItem: v3.PathItem, $: Context, options?: { isAnonymous?: boolean }): AsyncGenerator<OperationStructure> {
  const path = nameOf(pathItem);
  for (const method of values(common.HttpMethod)) {
    if (method in pathItem) {
      yield processOperation({method: <Method><unknown>method, path}, pathItem[<common.HttpMethod>method], pathItem, $);
    }
  }
  // addExtensionsToAttic($.api.http, pathItem);
}

export async function processOperation(path: Path, operation: v3.Operation, shared: v3.PathItemBase, $: Context): Promise<OperationStructure> {
  const [group, name] = getGroupAndName(operation, path.path);

  const parameters = new Array<ParameterTypeReference>();
  await processOperationParameters(shared.parameters, $, parameters);
  await processOperationParameters(operation.parameters, $, parameters);
  
  const requestBody = operation.requestBody ? await processRequestBody(operation.requestBody, $, { isAnonymous: true }) : undefined;

  const responses = new Array<ResponseTypeReference>();
  for (const [key, value] of items(operation.responses)) {
    responses.push(await processResponse(value, $, { isAnonymous: true, operation, code: key }));
  }

  return createOperationStructure(
    $.api,
    path,
    group,
    name, {
      summary: operation.summary || shared.summary,
      description: operation.description || shared.description,
      tags: operation.tags,
      parameters,
      requestBody,
      responses,
      ...versionInfo($, operation)
    });

  // TODO: Things below are not emitted to TS yet
  // pick up external docs
  // for await (const reference of processExternalDocs(operation.externalDocs, $)) {
  //   result.references.push(reference);
  // }

  // for await (const requirement of $.processArray(authenticationRequirement, operation.security)) {
  //   result.authenticationRequirements.push(requirement);
  // }
  
  // for await (const server of $.processArray(processServer, operation.servers)) {
  //   result.connections.push(server);
  // }

  // yield addExtensionsToAttic(result, operation);
}

async function processOperationParameters<T>(
  parameters: ReadonlyArray<v3.Parameter | v3.ParameterReference> | undefined,
  $: Context, 
  result: Array<ParameterTypeReference>
) {
  for (const each of values(parameters)) {
    const p = await processParameter(each, $, { isAnonymous: true });
    result.push(p);
  }
}
