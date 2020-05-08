import { v3 } from '@azure-tools/openapi';
import { use, valueOf } from '@azure-tools/sourcemap';
import { CookieParameter, HeaderParameter, PathParameter, QueryParameter, RenderStyle } from '../../../model/http/parameter';
import { firstOrDefault } from '../common';
import { processInline } from './schema';
import { Context } from './serializer';

export async function *parameter(parameter: v3.Parameter, $: Context, options?: { isAnonymous?: boolean }) {

  switch (valueOf(use(parameter.in))) {
    case v3.ParameterLocation.Path:
      return yield* processPathParameter(<v3.PathParameter>parameter, $, options);

    case v3.ParameterLocation.Cookie:
      return yield *processCookieParameter(<v3.CookieParameter>parameter, $, options);

    case v3.ParameterLocation.Query:
      return yield *processQueryParameter(<v3.QueryParameter>parameter, $, options);

    case v3.ParameterLocation.Header:
      return yield *processHeaderParameter(<v3.HeaderParameter>parameter, $, options);
  }
  throw $.error(`unknown parameter location '${parameter.in}'`, parameter);
 
}


export async function *processPathParameter(parameter: v3.PathParameter, $: Context, options?: { isAnonymous?: boolean })  {
  const schema = await firstOrDefault( processInline(parameter.schema, $)) || $.api.schemas.Any;
  const result = new PathParameter(parameter.name, schema,
    parameter.explode === undefined ? false : parameter.explode, {
      description: parameter.description,
      required: parameter.required,
      renderStyle: <any><unknown>parameter.style || RenderStyle.Simple
    });
  result.addToAttic('example', parameter.example);

  yield result;
}

export async function *processCookieParameter(parameter: v3.CookieParameter, $: Context, options?: { isAnonymous?: boolean })  {
  const schema = await firstOrDefault( processInline(parameter.schema, $)) || $.api.schemas.Any;
  const result = new CookieParameter(parameter.name, schema,
    parameter.explode === undefined ? true : parameter.explode, {
      description: parameter.description,
      required: parameter.required
    }
  );
  result.addToAttic('example', parameter.example);

  yield result;
}

export async function *processQueryParameter(parameter: v3.QueryParameter, $: Context, options?: { isAnonymous?: boolean }) {
  const schema = await firstOrDefault( processInline(parameter.schema, $)) || $.api.schemas.Any;
  const renderStyle = <any><unknown>parameter.style || RenderStyle.Form;
  const result = new QueryParameter(parameter.name, schema,
    parameter.explode === undefined ? renderStyle === RenderStyle.Form ? true : false : parameter.explode, {
      description: parameter.description,
      required: parameter.required,
      renderStyle,
      allowEmptyValue: parameter.allowEmptyValue,
      allowReserved: parameter.allowReserved,

    });
  result.addToAttic('example', parameter.example);
  yield result;
}
export async function *processHeaderParameter(parameter: v3.HeaderParameter, $: Context, options?: { isAnonymous?: boolean }) {
  const schema = await firstOrDefault( processInline(parameter.schema, $)) || $.api.schemas.Any;
  const result = new HeaderParameter(parameter.name, schema,
    parameter.explode === undefined ? false : parameter.explode, {
      description: parameter.description,
      required: parameter.required,
      renderStyle: <any><unknown>parameter.style || RenderStyle.Simple
    });
  result.addToAttic('example', parameter.example);

  yield result;
}