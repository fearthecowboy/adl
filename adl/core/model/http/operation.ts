import { valueOf } from '@azure-tools/sourcemap';
import { InterfaceDeclaration, MethodSignature, ParameterDeclarationStructure, StructureKind } from 'ts-morph';
import { normalizeIdentifier, normalizeName } from '../../support/codegen';
import { appendTag, getTagValue, setTag } from '../../support/doc-tag';
import { Alias } from '../alias';
import { ApiModel } from '../api-model';
import * as base from '../operation';
import { Reference } from '../reference';
import { NamedElement } from '../schema/schema';
import { ArrayCollectionImpl, Collection, CollectionImpl } from '../types';
import { Parameter, ParameterType } from './parameter';
import { AuthenticationRequirement, Connection } from './protocol';
import { Request } from './request';
import { Response } from './response';

export enum Method {
  Get = 'get',
  Put = 'put',
  Post = 'post',
  Delete = 'delete',
  Options = 'options',
  Head = 'head',
  Patch = 'patch',
  Trace = 'trace'
}

export interface Path {
  method: Method;
  path: string;
}

export interface Operation extends base.Operation {
  /** A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier. */
  readonly tags: Collection<string>;

  /** A group name to group this operation with others. */
  readonly group: string;

  /** A name for this operation within its group. */
  name: string;

  /** The HTTP method used and the path operated upon. */ 
  path: Path;

  /** parameters common to all the requests(overloads) for this operation */
  readonly parameters: Collection<Parameter | Alias<Parameter>>;

  /** possible requests that can be made for this operation (ie, overloads)  */
  readonly requests: Collection<Request | Alias<Request>>;

  /** non-error outputs from this operation */
  readonly responses: Collection<Response | Alias<Response>>;

  /** a collection of reference information regarding the operation  */
  readonly references: Collection<Reference>;

  /**
   * Authentication requirements for this operation, which override those specified globally.
   *
   * Only one of the elements in the array needs to be satisfied to authorize a request.
   */
  readonly authenticationRequirements: Collection<AuthenticationRequirement>;

  /** Connections for this operation, which override those specified globally. */
  readonly connections: Collection<Connection>;
}

export function createOperation(
  api: ApiModel, 
  path: Path, 
  group: string, 
  name: string, 
  initializer: Partial<Operation>
): Operation { 

  let groupNode = api.getGroup(group);
  if (!groupNode){
    const file = api.getFile(group, 'group');
    groupNode = file.addInterface({ name: group, isExported: true });
  }

  let count = 1;
  const baseName = name;
  while (groupNode.getMethod(name)){
    name = `${baseName}${count++}`;
  }

  const operationNode = groupNode.addMethod({ name: normalizeIdentifier(name) });
  const operation = new OperationImpl(operationNode, initializer);
  operation.path = path;
  return operation;
}

class OperationImpl extends NamedElement<MethodSignature> implements Operation {
  readonly tags: CollectionImpl<string, this>;
  readonly parameters: CollectionImpl<Parameter | Alias<Parameter>, this>;
  readonly requests = new ArrayCollectionImpl<Request>();
  readonly responses = new ArrayCollectionImpl<Response | Alias<Response>>();
  readonly references = new ArrayCollectionImpl<Reference>();
  readonly authenticationRequirements = new ArrayCollectionImpl<AuthenticationRequirement>();
  readonly connections = new ArrayCollectionImpl<Connection>();
  
  constructor(node: MethodSignature, initializer?: Partial<Operation>) {
    super(node);
    this.parameters = new CollectionImpl(this, this.pushParameters, undefined!, undefined!);
    this.tags = new CollectionImpl(this, this.pushTags, undefined!, undefined!);
    this.initialize(initializer);
  }

  get group() {
    return (<InterfaceDeclaration>(this.node.getParent())).getName()!;
  }

  get name() {
    return <string>super.name;
  }
  set name(value: string) {
    super.name = value;
  }

  get path(): Path {
    const tag = getTagValue(this.node, 'http')!;
    const  [method, path] = tag.split(' ', 2);
    return {method: Method[<keyof typeof Method>method], path};
  }
  set path(path: Path) {
    setTag(this.node, 'http', `${path.method.toUpperCase()} ${path.path}`);
  }
  
  private pushTags(...tags: Array<string>) {
    for (let each of tags) {
      each = valueOf(each);
      appendTag(this.node, 'tag', each);
    }
  }
    
  private pushParameters(...parameters: Array<Parameter | Alias<Parameter>>) {
    const structures = new Array<ParameterDeclarationStructure>();
    for (let each of parameters) {
      each = valueOf(each);
      const parameter = each instanceof Alias ? each.target : each;
      const name = normalizeName(parameter.name);
      const type = this.getParameterType(parameter, name);

      structures.push({
        kind: StructureKind.Parameter,
        hasQuestionToken: !parameter.required,
        name,
        type,
      });
    }
    
    this.node.addParameters(structures);
  }

  private getParameterType(parameter: Parameter, chosenName: string) {
    const innerType = this.project.getTypeReference(parameter.schema, this.node.getSourceFile());
    const outerType = this.getOuterType(parameter.type);
    const nameArg = parameter.name == chosenName ? '' : `, '${parameter.name}'`;
    return `${outerType}<${innerType}${nameArg}>`;
  }

  private getOuterType(parameterType: ParameterType) {
    switch (parameterType) {
      case ParameterType.Cookie:
        return 'Http.Cookie';
      case ParameterType.FormData:
        return 'Http.FormData';
      case ParameterType.Header:
        return 'Http.Header';
      case ParameterType.Path:
        return 'Http.Path';
      case ParameterType.Query:
        return 'Http.Query';
      default:
        throw new Error(`Invalid parameter type '${parameterType}'`);
    }
  }
}
