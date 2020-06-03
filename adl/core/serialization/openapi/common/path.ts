import { v2, v3 } from '@azure-tools/openapi';

let operationCounter = 1;

export function getGroupAndName(operation: v2.Operation | v3.Operation, path: string) {
  let group = '';
  let name = '';

  if (operation.operationId) {
    [group, name] = operation.operationId.split('_', 2);
    if (!name) {
      name = group;
      group = 'Service';
    }
  }
  else {
    group = 'Service';
    name = path.replace(/\{.*?\}/g, '').replace(/\/+$/g, '').replace(/^.*\//, '');
    if (!name && operation.tags) {
      name = operation.tags[0];
    }
    if (!name) {
      name = `Operation${operationCounter++}`;
    }
  }

  return [group, name];
}
