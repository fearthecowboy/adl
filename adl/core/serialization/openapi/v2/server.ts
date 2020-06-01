import { v2 } from '@azure-tools/openapi';
import { Connection } from '../../../model/http/protocol';
import { Context } from './serializer';

export async function* processServers(model: v2.Model, $: Context): AsyncGenerator<Connection> {
  for (const scheme of model.schemes ?? []) {
    const url = `${scheme}://${model.host}${model.basePath ?? '/'}`;
    yield new Connection(url);
  }
}