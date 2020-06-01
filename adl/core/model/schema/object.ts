import { InterfaceDeclaration, PropertySignature } from 'ts-morph';
import { normalizeIdentifier } from '../../support/codegen';
import { getTagValue, setTag } from '../../support/doc-tag';
import { TypeDeclaration } from '../../support/typescript';
import { ApiModel } from '../api-model';
import { Collection, CollectionImpl, Identity } from '../types';
import { NamedElement, Schema, TSSchema } from './schema';

export interface ObjectSchema extends Schema {
  /** schemas that this object extends */
  readonly parents: Collection<TSSchema<TypeDeclaration>>;
  
  /** the collection of properties that are in this object */
  readonly properties: Collection<Property>;
  
  /**  maximum number of properties permitted */
  maxProperties?: number;

  /**  minimum number of properties permitted */
  minProperties?: number;

  /** the desired name when generating code */
  clientName?: string;

  createProperty(name: string, schema: Schema, initializer?: Partial<Property>): Property;
}

export interface PropInitializer extends Partial<Property> {
  name: string;
  schema: Schema;
}

export class ObjectSchemaImpl extends TSSchema<InterfaceDeclaration> implements ObjectSchema {
  addParent(...parents: Array<TSSchema<TypeDeclaration>> ) {
    // ensure we have an import to the type
    // and add it to the list

    for(const parent of parents) {
      this.node.addExtends(this.getTypeReference(parent));
    }
  }

  removeParent(parent: TSSchema<TypeDeclaration>) {
    // remove the parent from the schema
    for( const base of this.node.getExtends() ) {
      // todo: how do we identify which base is the one we're removing.
      // have to debug this to find out.
      // if( /**??? */ ) {
      // this is the one, remove it
      // this.node.removeExtends(base);
      //  break;
      // }
    }

  }
  getParents(): Array<TSSchema<TypeDeclaration>> {
    // return a wrapper object for each typedecl
    return this.node.getBaseDeclarations().map( each => new TSSchema<TypeDeclaration>('',each)  );
  }

  getProperties() {
    return this.node.getProperties( ).map( each => new PropertyImpl(each));
  } 

  constructor(node: InterfaceDeclaration) {
    super('object', node);
    this.parents = new CollectionImpl(this, this.addParent, this.removeParent, this.getParents);
    this.properties = new CollectionImpl(this, undefined, undefined,this.getProperties );
  }
   
  parents: Collection<TSSchema<TypeDeclaration>>;
  properties: Collection<Property>;
 
  maxProperties?: number;
  minProperties?: number;
  clientName?: string;

  createProperty(name: string, schema: Schema, initializer?: Partial<Property>): Property {
    
    // the type is either a reference of a type that we have 
    // or it's an anonymous type that gets expanded
    const type = this.project.getTypeReference(schema,this.node.getSourceFile()) || 'any';

    const result = new PropertyImpl(this.node.addProperty({
      //todo: do a better 'fix-the-bad-name' (ie, perks/codegen)
      name: normalizeIdentifier(name),
      type
    }));

    result.initialize(initializer);

    return result;
  }

  get requiredTypeDeclarations(): Array<TypeDeclaration> {
    if( this.isInline ) {
      const x = this.node.getProperties().map(each => each.getType())  ;
      return [...<any>x , this.node];
    }
    return [this.node] ;
  }
}

export function createObjectSchema(api: ApiModel, identity: Identity, initializer?: Partial<ObjectSchema>): ObjectSchema {
  const {name, file} = api.getNameAndFile(identity, 'model');
  
  const result= new ObjectSchemaImpl(file.addInterface({
    //todo: do a better 'fix-the-bad-name' (ie, perks/codegen)
    name,
    isExported: true,
  }));

  result.initialize(initializer);

  return result;
}

export interface Property extends PropertyImpl {
  
}

export class PropertyImpl extends NamedElement<PropertySignature> {
   
  /** indicates the properts is required */
  get required(): boolean {
    return this.node.hasQuestionToken();
  }
  set required(value: boolean) {
    this.node.setHasQuestionToken(value);
  }

  /**
   * Declares the property as "read only".  
   * A property MUST NOT be marked as both readOnly and writeOnly being true. 
   * Default value is false.
   */
  get readonly(): boolean {
    return this.node.isReadonly();
  }
  set readonly(value: boolean) {
    this.node.setIsReadonly(value);
  }

  /**
   * Declares the property as "write only". 
   * A property MUST NOT be marked as both readOnly and writeOnly being true. 
   * Default value is false.
   * 
   */
  get writeonly(): boolean {
    // todo: tear apart the property type looking for `& WriteOnly`
    return false;
  }
  set writeonly(value: boolean) {
    // todo: implement by adding a `& WriteOnly`
  }
 
  /**
   * the desired name when generating code.
   */
  get clientName(): string|undefined {    
    return getTagValue( this.node, 'clientName');
  }
  set clientName(value: string|undefined) {
    setTag(this.node, 'clientName', value);
  }

  constructor(node: PropertySignature) {
    super(node);
  }
}

