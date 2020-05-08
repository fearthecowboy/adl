import { Dictionary, JsonReference, v3, vendorExtensions } from '@azure-tools/openapi';
import { use } from '@azure-tools/sourcemap';
import { ApiModel } from '../../../model/api-model';
import { Host } from '../../../support/file-system';
import { Context as Ctx, Visitor } from '../../../support/visitor';
import { consume, firstOrDefault } from '../common';
import { processExternalDocs, processInfo, processTag } from '../common/info';
import { processComponents } from './components';
import { path } from './path';
import { processServer } from './server';

/** takes an openapi3 model, converts it into a ADL model, and returns that */
export function loadOpenApi() {
  // nothing;

}

// node types that are objects
export type Context = Ctx<v3.Model>;

// node types that are objects or references
export type ItemsOf<T> = Dictionary<T | JsonReference<T>>;

export async function deserializeOpenAPI3(host: Host, ...inputs: Array<string>) {
  const output = await new Visitor<v3.Model>(new ApiModel(), host, 'oai3', ...inputs).process(processRoot);

  return output;
}

async function processRoot(oai3: v3.Model, $: Context) {

  const extensions = vendorExtensions(oai3);

  for (const [ key ] of extensions) {
    switch (key) {
      case 'x-ms-metadata':

        break;
      default:
        // record unknown extensions at model level
        break;
    }
  }

  // openapi3 info
  $.api.metaData = await firstOrDefault( $.process(processInfo, oai3.info)) || $.api.metaData;
  
  // extnernal docs are just a kind of reference
  for await (const reference of $.process(processExternalDocs, oai3.externalDocs)) {
    $.api.metaData.references.push(reference);
  }
  
  for await( const reference of  $.processArray(processTag, oai3.tags) ) {
    $.api.metaData.references.push(reference);
  }

  // components will have to be early, since other things will $ref them 
  await consume($.process(processComponents, oai3.components));

  for await( const server of $.processArray(processServer, oai3.servers)  ) {
    $.api.http.connections.push( server);
  }
  
  // await $.process(processSecurity, oai3.security);

  // paths second to last
  for await ( const operation of $.processDictionary(path, oai3.paths) ) {
    $.api.http.operations.push( operation);
  }
  for await (const operation of $.processDictionary(path, oai3['x-ms-paths'])) {
    $.api.http.operations.push(operation);
  }
  
  // we don't need this.
  use(oai3.openapi);

  return $.api;
}

