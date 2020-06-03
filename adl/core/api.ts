/** Interface for manipulating an API Description */
import { ApiModel } from './model/api-model';
export { deserializeOpenAPI2 } from './serialization/openapi/v2/serializer';
export { deserializeOpenAPI3 } from './serialization/openapi/v3/serializer';
export { Host } from './support/file-system';


/** load an API from a set of source files or folders */
async function loadApi(...inputs: Array<string>): Promise<ApiModel> {
  throw 'unimplemented';
}
/*
export interface TypeofExtension {
  readonly name: string;

  // when deserializing, the following names will be used to connect to the core.
  readonly oai3: string;
  readonly oai2: string;
  readonly adl: string;

  onRegister?: () => Promise<void>;
  new(parameters: Array<any>): Extension;
}

export interface Extension {
  init?: () => Promise<void>;
  onDeserializeOAI3<T>(context: Visitor<ApiModel, oai3, T>): Promise<T>;
  onDeserializeOAI2<T>(context: Visitor<ApiModel, oai2, T>): Promise<T>;
  //   onDeserializeADL<T>(context: Visitor<ApiModel, any, T>): Promise<T>;

  // onSerializeADL(): Promise<void>;
  onSerializeOAI3(): Promise<void>;
  onSerializeOAI2(): Promise<void>;
}


export function registerExtension(extensionClass: TypeofExtension) {
  // call the extension's onRegister method first
  if (extensionClass.onRegister) {
    extensionClass.onRegister();
  }

  // const x = new extensionClass([]);

  // store the extension and instantiate as needed.
  // new cls([]);
}

/*
class Foo {
  readonly name = 'Foo';


  readonly oai3 = 'x-ms-foo';
  readonly oai2 = 'x-ms-foo';
  readonly adl = 'Foo';

  async onDeserializeOAI3(context: Visitor<ApiModel, oai3, string>): Promise<string> {
    return '';
  }
  async onDeserializeOAI2(context: Visitor<ApiModel, oai2, string>): Promise<string> {
    return '';
  }
  // async onDeserializeADL(context: Visitor<ApiModel, Model, string>): Promise<string> {
  // return '';
  // }

  // async onSerializeADL(): Promise<void> {
  //
  //  }
  async onSerializeOAI3(): Promise<void> {

  }
  async onSerializeOAI2(): Promise<void> {

  }

}

registerExtension(Foo);

*/