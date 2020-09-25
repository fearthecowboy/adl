import { Program } from '../compiler/program.js';
import { ArrayType, InterfaceType, InterfaceTypeProperty, ModelType, ModelTypeProperty, Type, UnionType } from '../compiler/types.js';
import { getDoc } from './decorators.js';
import {
  basePathForResource,
  getHeaderFieldName,
  getPathParamName,
  getQueryParamName,
  getResources,
  isBody
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

  // Map types to their schema definition that will go in #/definitions. Inlined
  // schemas do not go in this map.
  const schemas = new Map<Type, any>();

  // Map model properties that represent shared parameters to their parameter
  // definition that will go in #/parameters. Inlined parameters do not go in
  // this map.
  const params = new Map<ModelTypeProperty, any>();

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

  function getPathParameters(iface: InterfaceType, prop: InterfaceTypeProperty) {
    return [
      ...(iface.parameters?.properties.values() ?? []),
      ...(prop.parameters?.properties.values() ?? []),
    ].filter((param) => getPathParamName(param) !== undefined);
  }

  /**
   * Translates endpoint names like `read` to REST verbs like `get`.
   */
  function pathForEndpoint(name: string, pathParams: ModelTypeProperty[], declaredPathParamNames: string[]): [string, string[], string?] {
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

  function emitEndpoint(resource: InterfaceType, prop: InterfaceTypeProperty) {
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
      prop.parameters,
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
      schema: getSchemaOrPlaceholder(responseModel),
    };

    const desc = getDoc(responseModel);
    response.description = desc ?? "";

    if (responseModel.kind === 'Model') {
      for (const prop of responseModel.properties.values()) {
        const type = prop.type;
        const headerName = getHeaderFieldName(prop);
        switch (headerName) {
          case undefined:
            break;
          case 'status-code':
            if (type.kind == "Number") {
              statusCode = String(type.value);
            }
            break;
          case 'content-type':
            if (type.kind === "String" ){
              contentType = type.value;
            }
            break;
          default:
            const header = getResponseHeader(prop);
            response.headers = response.headers ?? {};
            response.headers[headerName] = header;
            break;
        }
      }
    }

    if (!currentEndpoint.produces.includes(contentType)) {
      currentEndpoint.produces.push(contentType);
    }

    currentEndpoint.responses[statusCode] = response;
  }

  function getResponseHeader(prop: ModelTypeProperty) {
    const header: any = {};
    populateParameter(header, prop, undefined);
    delete header.in;
    delete header.name;
    delete header.required;
    return header;
  }


  function getSchemaOrPlaceholder(type: Type): any {
    if (schemas.has(type)) {
      return schemas.get(type);
    }
    const builtIn = mapADLTypeToOpenAPI(type);
    if (builtIn !== undefined) {
      return builtIn;
    }

    const name = getTypeNameForSchemaProperties(type);
    if (!isRefSafeName(name)) {
      // Schema's name is not reference-able in OpenAPI so we inline it.
      // This will usually happen with instantiated/anonymous types, but could also
      // happen if ADL identifier uses characters that are problematic for OpenAPI.
      // Users will have to rename / alias type to have it get ref'ed.
      const schema = getSchemaForType(type);
      // helps to read output and correlate to ADL
      schema['x-adl-name'] = name; 
      return schema;
    } else {
      const placeholder = {};
      schemas.set(type, placeholder);
      return placeholder;
    }
  }

  function getParamPlaceholder(parent: ModelType | undefined, property: ModelTypeProperty) {
    if (params.has(property)) {
      return params.get(property);
    }

    const placeholder = {};
    if (!parent?.ownProperties.has(property.name)) {
      // only parameters inherited by spreading or from interface are shared in #/parameters
      params.set(property, placeholder);
    }
    return placeholder;
  }

  function emitEndpointParameters(
    parent: ModelType | undefined,
    resourceParams: ModelTypeProperty[],
    methodParams: ModelTypeProperty[]
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
        emitParameter(parent, param, 'path');
      } else if (queryInfo) {
        emitParameter(parent, param, 'query');
      } else if (headerInfo) {
        emitParameter(parent, param, 'header');
      } else if (bodyInfo) {
        emitParameter(parent,param, 'body');
      } else {
        if (emittedImplicitBodyParam) {
          throw new Error('request has multiple body types');
        }
        emittedImplicitBodyParam = true;
        emitParameter(parent, param, 'body');
      }
    }
  }

  function emitParameter(parent: ModelType | undefined, param: ModelTypeProperty, kind: string) {
    const ph = getParamPlaceholder(parent, param);
    populateParameter(ph, param, kind);

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

  function populateParameter(ph: any, param: ModelTypeProperty, kind: string | undefined) {
    ph.name = param.name;
    ph.in = kind;
    ph.required = !param.optional;
    ph.description = getDoc(param);

    let schema = getSchemaOrPlaceholder(param.type);
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
  }

  function emitReferences() {
    for (const [property, param] of params) {
      const key = getParameterKey(property, param);
      root.parameters[key] = {
        ...param,
      };

      for (const key of Object.keys(param)) {
        delete param[key];
      }

      param['$ref'] = '#/parameters/' + key;
    }

    for (const [type, schema] of schemas) {
      const name = getTypeNameForSchemaProperties(type);
      const schemaForType = getSchemaForType(type);
      root.definitions[name] = schemaForType;

      for (const key of Object.keys(schema)) {
        delete schema[key];
      }

      schema['$ref'] = '#/definitions/' + name;
    }
  }

  function getParameterKey(property: ModelTypeProperty, param: any) {
    const parent = program.checker!.getTypeForNode(property.node.parent!) as ModelType;
    let key = program.checker!.getTypeName(parent);
    if (parent.ownProperties.size > 1) {
      key += `.${property.name}`;
    }

    const baseKey = getRefSafeName(key);
    if (baseKey === key) {
      return key;
    }

    // deal with collisions we could introduce by mangling name
    let counter = 1;
    while (root.parameters[key] !== undefined) {
      key = baseKey + "." + counter;
      counter++;
    }

    return key;
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
      items: getSchemaOrPlaceholder(target),
    };
  }

  function getSchemaForModel(model: ModelType) {
    model = getTypeForSchemaProperties(model);

    const modelSchema: any = {
      type: 'object',
      properties: {},
      description: getDoc(model),
    };

    for (const [name, prop] of model.ownProperties) {
      if (!isSchemaProperty(prop)) {
        continue;
      }

      const description = getDoc(prop);
      if (!prop.optional) {
        if (!modelSchema.required) {
          modelSchema.required = [];
        }
        modelSchema.required.push(name);
      }

      modelSchema.properties[name] = getSchemaOrPlaceholder(prop.type);
      if (description) {
        modelSchema.properties[name].description = description;
      }
    }

    if (model.baseModels.length > 0) {
      for (let base of model.baseModels) {
        base = getTypeForSchemaProperties(base);
        if (hasSchemaProperties(base.properties)) {
          if (!modelSchema.allOf) {
            modelSchema.allOf = [];
          }
          modelSchema.allOf.push(getSchemaOrPlaceholder(base));
        }
      }
    }
    return modelSchema;
  }

  /**
   * A "schema property" here is a property that is emitted to OpenAPI schema.
   *
   * Headers, parameters, status codes are not schema properties even they are
   * represented as properties in ADL.
   */
   function isSchemaProperty(property: ModelTypeProperty) {
    const headerInfo = getHeaderFieldName(property);
    const queryInfo = getQueryParamName(property);
    const pathInfo = getPathParamName(property);
    return !(headerInfo || queryInfo || pathInfo);
  }

  /**
   * If a model type has an unspeakable name in OpenAPI, no schema properties of
   * its own, and exactly one base model that has schema properties, then when
   * emitting the type as a schema, we can use the single base model with schema
   * properties directly. The other properties will go elsewhere in OpenAPI. 
   *
   * This ensures we use the best name in OpenAPI when the ADL pattern of adding
   * headers and status codes is done by instantiating a template. For example,
   * given `Ok<T> { @header statusCode: 200; ... T }`, then T is the schema
   * type.
   */
  function getTypeForSchemaProperties(type: ModelType): ModelType {
    if (type.baseModels.length === 0 || hasSchemaProperties(type.ownProperties)) {
      return type;
    }

    if (type.baseModels.length === 1) {
      return getTypeForSchemaProperties(type.baseModels[0]);
    }

    let schemaBase = undefined;
    for (let base of type.baseModels) {
      base = getTypeForSchemaProperties(base);
      if (hasSchemaProperties(base.properties)) {
        if (schemaBase) {
          // more than one base with schema properties, can't reduce.
          return type; 
        }
        schemaBase = base;
      }
    }

    return schemaBase ?? type;
  }

  function getTypeNameForSchemaProperties(type: Type) {
    if (type.kind === 'Model') {
      type = getTypeForSchemaProperties(type);
      if (!hasSchemaProperties(type.properties)) {
        return "{}";
      }
    }
    return program!.checker!.getTypeName(type);
  }

  function hasSchemaProperties(properties: Map<string, ModelTypeProperty>) {
    for (const property of properties.values()) {
      if (isSchemaProperty(property)) {
        return true;
      }
    }
    return false;
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

  function isRefSafeName(name: string) {
    return /^[A-Za-z0-9-_.]+$/.test(name);
  }

  function getRefSafeName(name: string) {
    return name.replace(/^[A-Za-z0-9-_.]/g, '_');
  }
}


