import { Program } from '../compiler/program.js';
import { ArrayType, InterfaceType, InterfaceTypeProperty as InterfacePropertyType, ModelType, ModelTypeProperty as ModelPropertyType, Type, UnionType } from '../compiler/types.js';
import { getDoc } from './decorators.js';
import {
  basePathForResource,
  getHeaderFieldName,
  getPathParamName,
  getQueryParamName,
  getResources,
  isBody,
  isStatus
} from './rest.js';


export function onBuild(p: Program) {
  const emitter = createOAPIEmitter(p);
  emitter.emitOpenAPI();
}

const operationIds = new Map<Type, string>();
export function operationId(program: Program, entity: Type, opId: string) {
  operationIds.set(entity, opId);
}

function createOAPIEmitter(program: Program) {
  const root: any = {
    swagger: '2.0',
    info: {
      title: '(title)',
      version: '0000-00-00'
    },
    schemes: ['https'],
    paths: {},
    definitions: {},
    parameters: {},
  };

  let currentBasePath: string | undefined = '';
  let currentPath: any = root.paths;
  let currentEndpoint: any;

  // map types to their schemas
  const schemas = new Map();

  // map types to their param nodes
  const params = new Map();

  return { emitOpenAPI };

  function emitOpenAPI() {
    for (let resource of getResources()) {
      if (resource.kind !== 'Interface') {
        throw new Error("Resource goes on interface");
      }

      emitResource(<InterfaceType>resource);
    }
    emitReferences();

    console.log(JSON.stringify(root, null, 4));
  }

  function emitResource(resource: InterfaceType) {
    currentBasePath = basePathForResource(resource);

    for (const [name, prop] of resource.properties) {
      emitEndpoint(resource, prop);
    }
  }

  function getPathParameters(iface: InterfaceType, prop: InterfacePropertyType) {
    return [
      ...(iface.parameters?.properties.values() ?? []),
      ...(prop.parameters?.properties.values() ?? []),
    ].filter((param) => getPathParamName(param) !== undefined);
  }

  /**
   * Translates endpoint names like `read` to REST verbs like `get`.
   */
  function pathForEndpoint(name: string, pathParams: ModelPropertyType[], declaredPathParamNames: string[]): [string, string[], string?] {
    const paramByName = new Map(pathParams.map((p) => [p.name, p]));
    const pathSegments = [];

    // for each param in the declared path parameters (e.g. /foo/{id} has one, id),
    // delete it because it doesn't need to be added to the path.
    for (const declaredParam of declaredPathParamNames) {
      const param = paramByName.get(declaredParam);
      if (!param) {
        throw new Error(
          `Path contains parameter ${declaredParam} but wasn't found in given parameters`
        );
      }

      paramByName.delete(declaredParam);
    }

    // for any remaining declared path params
    for (const name of paramByName.keys()) {
      pathSegments.push(name);
    }

    const verb = verbForEndpoint(name);
    if (verb) {
      return [verb, pathSegments];
    } else {
      return ['get', pathSegments, name];
    }
  }

  function verbForEndpoint(name: string) {
    switch (name) {
      case 'list':
        return 'get';
      case 'create':
        return 'post';
      case 'read':
        return 'get';
      case 'update':
        return 'get';
      case 'delete':
        return 'delete';
      case 'deleteAll':
        return 'delete';
    }

    return undefined;
  }

  function emitEndpoint(resource: InterfaceType, prop: InterfacePropertyType) {
    const declaredPathParamNames =
      currentBasePath?.match(/\{\w+\}/g)?.map((s) => s.slice(1, -1)) ?? [];
    const params = getPathParameters(resource, prop);
    const [verb, newPathParams, subScope = ''] = pathForEndpoint(
      prop.name,
      params,
      declaredPathParamNames
    );
    const subpath =
      currentBasePath +
      (subScope ? '/' + subScope : '') +
      (newPathParams.length > 0
        ? '/' + newPathParams.map((p) => '{' + p + '}').join('/')
        : '');

    if (subpath === undefined) throw new Error('uhoh');

    if (!root.paths[subpath]) {
      root.paths[subpath] = {};
    }

    currentPath = root.paths[subpath];
    if (!currentPath[verb]) {
      currentPath[verb] = {};
    }
    currentEndpoint = currentPath[verb];
    if (operationIds.has(prop)) {
      currentEndpoint.operationId = operationIds.get(prop);
    }
    currentEndpoint.summary = getDoc(prop);
    currentEndpoint.consumes = [];
    currentEndpoint.produces = [];
    currentEndpoint.parameters = [];
    currentEndpoint.responses = {};

    emitEndpointParameters(
      [...resource.parameters?.properties.values() ?? []],
      [...prop.parameters?.properties.values() ?? []],
    );
    emitResponses(prop.returnType);
  }

  function emitResponses(responseType: Type) {
    if (responseType.kind === 'Union') {
      for (const [i, option] of responseType.options.entries()) {
        emitResponseObject(option, i === 0 ? '200' : 'default');
      }
    } else {
      emitResponseObject(responseType);
    }
  }

  function emitResponseObject(responseModel: Type, statusCode: string = '200') {
    if (
      responseModel.kind === 'Model' &&
      responseModel.assignmentType === undefined &&
      responseModel.properties.size === 0
    ) {
      currentEndpoint.responses[200] = {
        description: 'Null response',
      };

      return;
    }

    let contentType = 'application/json';
    const response: any = {
      headers: {},
      schema: getSchemaPlaceholder(responseModel),
    };

    const desc = getDoc(responseModel);
    response.description = desc ?? "";

    if (responseModel.kind === 'Model') {
      for (const [name, prop] of responseModel.properties) {
        const statusInfo = isStatus(prop);
        const headerInfo = getHeaderFieldName(prop);
        const desc = getDoc(prop);
        const type = prop.type;

        if (statusInfo && type.kind === "Number") {
          // TODO: handle types other than number.
          statusCode = String(type.value);
        } else if (headerInfo !== undefined && type.kind === "String") {
          if (
            (headerInfo === '' && name === 'contentType') ||
            headerInfo === 'contentType'
          ) {
            contentType = type.value;
          } else {
            // TODO: handle types other than string.
            response.headers[headerInfo] = {
              type: 'string',
            };
          }
          if (desc) {
            response.headers[headerInfo].description = desc;
          }
        }
      }
    }

    if (!currentEndpoint.produces.includes(contentType)) {
      currentEndpoint.produces.push(contentType);
    }

    currentEndpoint.responses[statusCode] = response;
  }

  function getSchemaPlaceholder(type: Type) {
    if (schemas.has(type)) {
      return schemas.get(type);
    }
    const builtIn = mapADLTypeToOpenAPI(type);
    if (builtIn !== undefined) {
      return builtIn;
    }

    const placeholder = {};

    schemas.set(type, placeholder);
    return placeholder;
  }

  function getParamPlaceholder(field: ModelPropertyType) {
    if (params.has(field)) {
      return params.get(field);
    }

    const placeholder = {};

    params.set(field, placeholder);
    return placeholder;
  }

  function emitEndpointParameters(
    resourceParams: ModelPropertyType[] = [],
    methodParams: ModelPropertyType[] = []
  ) {
    const parameters = [...resourceParams, ...methodParams];

    let emittedImplicitBodyParam = false;
    for (const param of parameters) {
      if (params.has(param)) {
        currentEndpoint.parameters.push(params.get(param));
        continue;
      }
      const queryInfo = getQueryParamName(param);
      const pathInfo = getPathParamName(param);
      const headerInfo = getHeaderFieldName(param);
      const bodyInfo = isBody(param);

      if (pathInfo) {
        emitParameter(param, 'path');
      } else if (queryInfo) {
        emitParameter(param, 'query');
      } else if (headerInfo) {
        emitParameter(param, 'header');
      } else if (bodyInfo) {
        emitParameter(param, 'body');
      } else {
        if (emittedImplicitBodyParam) {
          throw new Error('request has multiple body types');
        }
        emittedImplicitBodyParam = true;
        emitParameter(param, 'body');
      }
    }
  }

  function emitParameter(param: ModelPropertyType, kind: string) {
    const ph = getParamPlaceholder(param);
    ph.name = param.name;
    ph.in = kind;
    ph.required = !param.optional;
    ph.description = getDoc(param);

    let schema = getSchemaPlaceholder(param.type);
    if (kind == 'body') {
      ph.schema = schema;
    } else {
      schema = getSchemaForType(param.type);
      if (param.type.kind == 'Array') {
        schema.items = getSchemaForType(param.type.elementType);
      }
      for (const property in schema) {
        ph[property] = schema[property];
      }
    }

    if (kind === 'body') {
      let contentType = 'application/json';
      if (param.type.kind === "Model") {
        let contentTypeParam = param.type.properties.get('contentType');
        if (contentTypeParam) {
          if (contentTypeParam.type.kind === "String") {
            contentType = contentTypeParam.type.value;
          } else {
            throw new Error("contentType parameter must be a string");
          }
        }
      }

      if (!currentEndpoint.consumes.includes(contentType)) {
        currentEndpoint.consumes.push(contentType);
      }
    }
    currentEndpoint.parameters.push(ph);
  }

  function emitReferences() {
    for (const [param, paramRef] of params) {
      const keyBase = refSafeName(param.name);
      let key = keyBase;
      let counter = 0;

      while (true) {
        const existing = root.parameters[key];
        if (!existing || JSON.stringify(paramRef) == JSON.stringify(existing)) {
          break;
        }
        key = `${keyBase}-${counter++}`;
      }

      root.parameters[key] = {
        ...paramRef,
      };

      for (const key of Object.keys(paramRef)) {
        delete paramRef[key];
      }

      paramRef['$ref'] = '#/parameters/' + key;
    }

    for (const [type, schema] of schemas) {
      const adlName = program.checker!.getTypeName(type);
      const nameBase = refSafeName(adlName);
      let name = nameBase;
      let counter = 0;

      const schemaForType = getSchemaForType(type);
      if (name != adlName) {
        schemaForType['x-adl-name'] = adlName;
      }

      while (true) {
        const existing = root.definitions[name];
        if (!existing || JSON.stringify(existing) == JSON.stringify(schemaForType)) {
          break;
        }
        name = `${nameBase}-${counter++}`;
      }

      root.definitions[name] = schemaForType;

      for (const key of Object.keys(schema)) {
        delete schema[key];
      }

      schema['$ref'] = '#/definitions/' + name;
    }
  }
  function getSchemaForType(type: Type) {
    const builtinType = mapADLTypeToOpenAPI(type);
    if (builtinType !== undefined) return builtinType;

    if (type.kind === 'Array') {
      return getSchemaForArray(type);
    } else if (type.kind === 'Model') {
      return getSchemaForModel(type);
    } else if (type.kind === 'Union') {
      return getSchemaForUnion(type);
    }

    throw new Error("Couldn't get schema for type " + type.kind);
  }

  function getSchemaForUnion(union: UnionType) {
    let type: string;
    const kind = union.options[0].kind;
    switch (kind) {
      case 'String':
        type = 'string';
        break;
      case 'Number':
        type = 'number';
        break;
      case 'Boolean':
        type = 'boolean';
        break;
      default:
        throw invalidUnionForOpenAPIV2();
    }

    const values = [];
    for (const option of union.options) {
      if (option.kind != kind) {
        throw invalidUnionForOpenAPIV2();
      }
      values.push(option.value);
    }

    return { type, enum: values };

    function invalidUnionForOpenAPIV2() {
      return new Error("Unions cannot be emitted to OpenAPI v2 unless all options are literals of the same type.");
    }
  }

  function getSchemaForArray(array: ArrayType) {
    const target = array.elementType;

    return {
      type: 'array',
      items: getSchemaPlaceholder(target),
    };
  }

  function getSchemaForModel(model: ModelType) {
    const modelSchema: any = {
      type: 'object',
      properties: {},
      description: getDoc(model),
    };

    for (const [name, prop] of model.properties) {
      const headerInfo = getHeaderFieldName(prop);
      const queryInfo = getQueryParamName(prop);
      const pathInfo = getPathParamName(prop);
      const statusInfo = isStatus(prop);
      const description = getDoc(prop);
      if (headerInfo || queryInfo || pathInfo || statusInfo) {
        continue;
      } else {
        if (!prop.optional) {
          if (!modelSchema.required) {
            modelSchema.required = [];
          }
          modelSchema.required.push(name);
        }
        modelSchema.properties[name] = getSchemaPlaceholder(prop.type);
        if (description) {
          modelSchema.properties[name].description = description;
        }
      }
    }

    return modelSchema;
  }

  function mapADLTypeToOpenAPI(adlType: Type) {
    switch (adlType.kind) {
      case 'Number':
        return { type: 'number', enum: [adlType.value] };
      case 'String':
        return { type: 'string', enum: [adlType.value] };
      case 'Boolean':
        return { type: 'boolean', enum: [adlType.value] };
      case 'Model':
        switch (adlType.name) {
          case 'int32':
            return { type: 'integer', format: 'int32' };
          case 'int64':
            return { type: 'integer', format: 'int64' };
          case 'float64':
            return { type: 'number' };
          case 'string':
            return { type: 'string' };
          case 'boolean':
            return { type: 'boolean' };
          case 'date':
            return { type: 'string', format: 'date' };
        }
      // fallthrough
      default:
        return undefined;
    }
  }

  function refSafeName(name: string) {
    return name
      .replace(/ \| /g, '-or-')
      .replace(/\[\]/g, '-array')
      .replace(/\</g, '-of-')
      .replace(/\, /g, '-and-')
      .replace(/ \& /g, '-plus-')
      .replace(/\>/g, '')
      .replace(/[^A-Za-z0-9_-]/g, '_');
  }
}
