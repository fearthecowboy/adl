import { items, length, values } from '@azure-tools/linq';
import { v3 } from '@azure-tools/openapi';
import { anonymous, nameOf } from '@azure-tools/sourcemap';
import { Response } from '../../../model/http/response';
import { addExtensionsToAttic, firstOrDefault } from '../common';
import { header } from './header';
import { processInline } from './schema';
import { Context } from './serializer';


export async function* response(response: v3.Response, $: Context, options?: { isAnonymous?: boolean }): AsyncGenerator<Response> {
  const responseName = options?.isAnonymous ? anonymous('response') : nameOf(response);

  if (length(response.content) === 0) {
    // no body/content
    const result = new Response(responseName, '', {
      description: response.description,
    });

    for (const value of values(response.headers)) {
      for await (const h of $.processInline(header, value)) {
        result.headers.push(h);
      }
    }
    return yield addExtensionsToAttic(result, response);
  }

  for (const [mediaType, type] of items(response.content)) {
    const result = new Response(responseName, mediaType, {
      description: response.description,
      schema: await firstOrDefault(processInline(type.schema, $)),
    });

    for (const value of values(response.headers)) {
      for await (const h of $.processInline(header, value)) {
        result.headers.push(h);
      }
    }

    // example data we can figure out later.
    result.addToAttic('example', type.example);
    // example data we can figure out later.
    result.addToAttic('examples', (<any>type).examples);

    // encoding information not necessary yet... 
    result.addToAttic('encoding', type.encoding);

    yield addExtensionsToAttic(result, response);
  }

}

