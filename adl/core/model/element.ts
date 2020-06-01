import { Dictionary, items } from '@azure-tools/linq';
import { Node } from 'ts-morph';
import { setTag } from '../support/doc-tag';
import { getPath, project } from '../support/typescript';
import { InternalData } from './internal-data';
import { VersionInfo } from './version-info';


export interface Attic extends Dictionary<any> {

}

/** inheriting from Initializer adds an apply<T> method to the class, allowing you to accept an object initalizer, and applying it to the class in the constructor. */
export class Initializer {
  initialize<T>(initializer?: Partial<T>) {
    const isBackedByTS = 'node' in this;

    for (const [key, value] of items(initializer)) {
      // copy the true value of the items to the object
      // (use the proxy)
        
      const rawThis = <any>this;

      if (value !== undefined) {
        const rawValue = (<any>value);
        
        const targetProperty = rawThis[key];
        if (targetProperty && targetProperty.push ) {
          if (rawValue[Symbol.iterator]) {
            // copy elements to target
            for (const each of rawValue) {
              rawThis[key].push(each);
            }
            continue;
          }
          throw new Error(`Initializer for object with array member '${key}', must be initialized with something that can be iterated.`);
        }
        // just copy the value across.
        rawThis[key] = (<any>value);
      }
    }
    return this;
  }
}


/** 
 * Base type for all objects in the model 
 */
export class Element extends Initializer {
  internalData?: Dictionary<InternalData>;
  versionInfo = new Array<VersionInfo>();
  attic?: Attic;

  constructor(initializer?: Partial<Element>) {
    super();
    this.initialize(initializer);
  }

  addToAttic(name: string, value: any) {
    if (value) {
      this.attic = this.attic || {};
      this.attic[name] = value;
    }
    return this;
  }

  addInternalData(key: string, internalData: InternalData) {
    this.internalData = this.internalData || {};
    this.internalData[key] = internalData;
  }

  addVersionInfo(info: VersionInfo) { 
    this.versionInfo.push(info);
  }
}

export class TSElement<TNode extends Node> extends Initializer implements Element  {
  constructor(public node: TNode, initializer?: Partial<TSElement<TNode>>) {
    super();
    this.initialize(initializer);
  }

  get internalData() {
    const pv =  this.project.getPrivateData(getPath(this.node));
    if(!pv.internalData) {
      pv.internalData = {};
    }
    return pv.internalData;
  }
  
  get versionInfo(): Array<VersionInfo> {
    // get versions back from doctags.
    return [];
  }
  
  get attic(): Attic  {
    const pv = this.project.getPrivateData(getPath(this.node));
    if (!pv.attic) {
      pv.attic = {};
    }
    return pv.attic;
  }

  addToAttic(name: string, value: any): this {
    if (value) {
      this.attic[name] = value;
    }
    return this;
  }
  
  addInternalData(key: string, internalData: InternalData): void {
    this.internalData[key] = internalData;
  }

  addVersionInfo(info: VersionInfo) {
    if(info.added) {
      setTag(this.node, 'since', info.added);
    }
    if (info.deprecated ) {
      setTag(this.node, 'deprecated', info.deprecated);
    }
  }


  protected get project() {
    return project(this.node);
  }

  protected get sourceFile() {
    return this.node.getSourceFile();
  }

  protected getTypeReference(schema: any) {
    return this.project.getTypeReference(schema, this.sourceFile);
  }
}
