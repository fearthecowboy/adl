import { values } from '@azure-tools/linq';
import { v2 } from '@azure-tools/openapi';
import { anonymous, nameOf } from '@azure-tools/sourcemap';
import { Request } from '../../../model/http/request';
import { singleOrDefault } from '../common';
import { processInline } from './schema';
import { Context } from './serializer';

export async function* requestBody(body: v2.BodyParameter, $: Context, options?: { isAnonymous?: boolean; operation: v2.Operation }): AsyncGenerator<Request> {
  // a single request body gets turned into multiple requests with the same name 
  // (since we only want very weak binding between the requests, that's the job of the actual operation. )

  const bodyName = body.name || options?.isAnonymous ? anonymous('requestBody') : nameOf(body);
  const operation = options?.operation;
  const consumes = operation?.consumes || $.sourceModel.consumes || [];

  for (const mediaType of values(consumes)) {
    const schema = await singleOrDefault(processInline(<v2.Schema>body.schema, $)) || $.api.schemas.Any;
    const request = new Request(bodyName, mediaType, schema, {
      description: body.description,
      required: body.required,
      name: body.name
    });

    // example data we can figure out later.
    request.addToAttic('x-ms-examples', operation?.['x-ms-examples']);

    yield request;
  }
}

