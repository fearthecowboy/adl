import { items } from '@azure-tools/linq';
import { v2 } from '@azure-tools/openapi';
import { nameOf, use, valueOf } from '@azure-tools/sourcemap';
import { ApiKeyAuthentication, AuthorizationCodeOAuth2Flow, ClientCredentialsOAuth2Flow, HttpAuthentication, ImplicitOAuth2Flow, OAuth2Authentication, OAuth2Flow, OAuth2Flows, OAuth2Scope, ParameterLocation, PasswordOAuth2Flow } from '../../../model/http/protocol';
import { addExtensionsToAttic } from '../common';
import { Context } from './serializer';

export async function* securityScheme(scheme: v2.SecurityScheme, $: Context) {
  switch (valueOf(use(scheme.type))) {
    case 'apiKey':
      return yield *apiKeyAuthentication(<v2.ApiKeySecurityScheme>scheme, $);
    case 'basic':
      return yield *basicAuthentication(<v2.BasicAuthenticationSecurityScheme>scheme, $);
    case 'oauth2':
      return yield *oauth2Authentication(<v2.OAuthSecurityBase>scheme, $);
  }

  $.error(`unknown security definition type '${scheme.type}'`, scheme);
}

function *apiKeyAuthentication(scheme: v2.ApiKeySecurityScheme, $: Context) {
  let location: ParameterLocation;

  switch (valueOf(use(scheme.in))) {
    case 'header':
      location = ParameterLocation.Header;
      break;
    case 'query':
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

function *basicAuthentication(scheme: v2.BasicAuthenticationSecurityScheme, $: Context) {
  yield addExtensionsToAttic(new HttpAuthentication(nameOf(scheme), 'basic', {
    description: scheme.description
  }), scheme);
}

function *oauth2Authentication(scheme: v2.OAuthSecurityBase, $: Context) {
  let flow: OAuth2Flow;
  const flows = new OAuth2Flows();

  switch (valueOf(use(scheme.flow))) {
    case 'password': {
      const password = <v2.OAuth2PasswordSecurityScheme>scheme;
      flow = flows.password = new PasswordOAuth2Flow(password.tokenUrl);
      break;
    }
    case 'implicit': {
      const implicit = <v2.OAuth2ImplicitSecurityScheme>scheme;
      flow = flows.implicit = new ImplicitOAuth2Flow(implicit.authorizationUrl);
      break;
    }
    case 'application': {
      const application = <v2.OAuth2ApplicationSecurityScheme>scheme;
      flow = flows.clientCredentials = new ClientCredentialsOAuth2Flow(application.tokenUrl);
      break;
    }
    case 'accessCode': {
      const accessCode = <v2.OAuth2AccessCodeSecurityScheme>scheme;
      flow = flows.authorizationCode = new AuthorizationCodeOAuth2Flow(accessCode.authorizationUrl, accessCode.tokenUrl);
      break;
    }
    default:
      $.error(`unknown oauth2 flow: '${scheme.flow}'`, scheme);
      return;
  }

  for (const { key: name, value: description } of items(use(scheme.scopes))) {
    flow.scopes.push(new OAuth2Scope(name, description));
  }

  yield addExtensionsToAttic(new OAuth2Authentication(nameOf(scheme), flows, {
    description: scheme.description
  }), scheme);
}

