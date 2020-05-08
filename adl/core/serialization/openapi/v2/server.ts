import { v2 } from '@azure-tools/openapi';
import { use } from '@azure-tools/sourcemap';
import { Connection } from '../../../model/http/protocol';
import { Context } from './serializer';

export async function* processServers(model: v2.Model, $: Context): AsyncGenerator<Connection> {
  for (const scheme of use(model.schemes) ?? []) {
    const url = `${use(scheme)}://${use(model.host)}${use(model.basePath) ?? '/'}`;
    yield new Connection(url);
  }
}