import { Dictionary, JsonReference, v2, vendorExtensions } from '@azure-tools/openapi';
import { use } from '@azure-tools/sourcemap';
import { ApiModel } from '../../../model/api-model';
import { Host } from '../../../support/file-system';
import { Context as Ctx, Visitor } from '../../../support/visitor';
import { firstOrDefault } from '../common';
import { processInfo } from '../common/info';

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
  
  $.api.metaData = await firstOrDefault($.process(processInfo, oai2.info)) || $.api.metaData;

  // we don't need this.
  use(oai2.swagger);

  return $.api;
}

