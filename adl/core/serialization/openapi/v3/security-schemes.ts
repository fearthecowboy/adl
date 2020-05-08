import { items } from '@azure-tools/linq';
import { v3 } from '@azure-tools/openapi';
import { nameOf, use, valueOf } from '@azure-tools/sourcemap';
import { ApiKeyAuthentication, AuthorizationCodeOAuth2Flow, ClientCredentialsOAuth2Flow, HttpAuthentication, ImplicitOAuth2Flow, OAuth2Authentication, OAuth2Flow, OAuth2Flows, OAuth2Scope, OpenIdConnectAuthentication, ParameterLocation, PasswordOAuth2Flow } from '../../../model/http/protocol';
import { addExtensionsToAttic } from '../common';
import { Context } from './serializer';

export async function* securityScheme(scheme: v3.SecurityScheme, $: Context) {
  switch (valueOf(use(scheme.type))) {
    case v3.SecurityType.ApiKey:
      return yield *apiKeyAuthentication(<v3.ApiKeySecurityScheme>scheme, $);

    case v3.SecurityType.Http:
      return yield *httpAuthentication(<v3.HttpSecurityScheme>scheme, $);

    case v3.SecurityType.OAuth2:
      return yield *oauth2Authentication(<v3.OAuth2SecurityScheme>scheme, $);

    case v3.SecurityType.OpenIdConnect:
      return yield *openIdConnectAuthentication(<v3.OpenIdConnectSecurityScheme>scheme, $);
  }

  $.error(`unknown security scheme type '${scheme.type}'`, scheme);
}

function *apiKeyAuthentication(scheme: v3.ApiKeySecurityScheme, $: Context) {
  let location: ParameterLocation;

  switch (valueOf(use(scheme.in))) {
    case v3.ParameterLocation.Cookie:
      location = ParameterLocation.Cookie;
      break;
    case v3.ParameterLocation.Header:
      location = ParameterLocation.Header;
      break;
    case v3.ParameterLocation.Query:
      location = ParameterLocation.Query;
      break;

    default:
      $.error(`unknown apikey parameter location: '${scheme.in}'`, scheme);
      return;
  }

  yield addExtensionsToAttic(new ApiKeyAuthentication(nameOf(scheme), scheme.name, location, {
    description: scheme.description
  }), scheme);
}

function *httpAuthentication(scheme: v3.HttpSecurityScheme, $: Context) {
  yield addExtensionsToAttic( new HttpAuthentication(nameOf(scheme), scheme.scheme, {
    bearerFormat: scheme.bearerFormat,
    description: scheme.description,
  }), scheme);
}

function *oauth2Authentication(scheme: v3.OAuth2SecurityScheme, $: Context) {
  const flows = new OAuth2Flows({
    implicit: implicitFlow(scheme.flows.implicit),
    password: passwordFlow(scheme.flows.password),
    clientCredentials: clientCredentialsFlow(scheme.flows.clientCredentials),
    authorizationCode: authorizationCodeFlow(scheme.flows.authorizationCode)
  });

  yield addExtensionsToAttic(new OAuth2Authentication(nameOf(scheme), flows, {
    description: scheme.description
  }),scheme);
}

function *openIdConnectAuthentication(scheme: v3.OpenIdConnectSecurityScheme, $: Context) {
  yield addExtensionsToAttic(new OpenIdConnectAuthentication(nameOf(scheme), scheme.openIdConnectUrl, {
    description: scheme.description
  }), scheme);
}

function implicitFlow(flow?: v3.ImplicitOAuthFlow) {
  if (!flow) {
    return undefined;
  }

  const result = new ImplicitOAuth2Flow(flow.authorizationUrl, {
    refreshUrl: flow.refreshUrl
  });

  addScopes(result, flow.scopes);
  return result;
}

function passwordFlow(flow?: v3.PasswordOAuthFlow) {
  if (!flow) {
    return undefined;
  }

  const result = new PasswordOAuth2Flow(flow.tokenUrl, {
    refreshUrl: flow.refreshUrl
  });

  addScopes(result, flow.scopes);
  return result;
}

function clientCredentialsFlow(flow?: v3.ClientCredentialsFlow) {
  if (!flow) {
    return undefined;
  }

  const result = new ClientCredentialsOAuth2Flow(flow.tokenUrl, {
    refreshUrl: flow.refreshUrl
  });

  addScopes(result, flow.scopes);
  return result;
}

function authorizationCodeFlow(flow?: v3.AuthorizationCodeOAuthFlow) {
  if (!flow) {
    return undefined;
  }

  const result = new AuthorizationCodeOAuth2Flow(flow.authorizationUrl, flow.tokenUrl, {
    refreshUrl: flow.refreshUrl
  });

  addScopes(result, flow.scopes);
  return result;
}

function addScopes(flow: OAuth2Flow, scopes: v3.Dictionary<string>) {
  for (const [ name, description] of items(scopes)) {
    flow.scopes.push(new OAuth2Scope(name, description));
  }
}

