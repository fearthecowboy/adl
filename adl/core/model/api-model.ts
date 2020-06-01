import { exists, isFile, mkdir, rmdir, writeFile } from '@azure-tools/async-io';
import { Dictionary } from '@azure-tools/linq';
import { isAnonymous, Path, valueOf } from '@azure-tools/sourcemap';
import { dirname, join } from 'path';
import { EnumDeclaration, IndentationText, NewLineKind, Node, Project, QuoteKind, SourceFile } from 'ts-morph';
import { getNode, referenceTo } from '../support/typescript';
import { Attic } from './element';
import { SerializationResult } from './format';
import { HttpProtocol } from './http/protocol';
import { InternalData } from './internal-data';
import { Metadata } from './metadata';
import { Resource } from './resource';
import { Schema } from './schema/schema';
import { Schemas } from './schema/schemas';
import { Folders, Identity } from './types';
import { VersionInfo } from './version-info';

export class ApiModel {
  #project: Project = new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
      newLineKind: NewLineKind.LineFeed,
      quoteKind: QuoteKind.Single,
    },
  });

  counter = 0;

  #folders = <Folders>{
    anonymous: this.#project.createDirectory('anonymous'),
    alias: this.#project.createDirectory('aliases'),
    model: this.#project.createDirectory('models'),
    enum : this.#project.createDirectory('enums'),
    group: this.#project.createDirectory('operations'),
    resource: this.#project.createDirectory('resources'),
  }
  
  privateData = new Map<string,any>();

  get project() {
    return this.#project;
  }
  getPrivateData(path: Path): Dictionary<any> {
    const p = path.join('/');
    let v = this.privateData.get(p);
    if( !v ) {
      this.privateData.set(p, v = {});
    }
    return v;
  }
  
  internalData: Dictionary<InternalData> = {};
  
  metaData = new Metadata('');

  resources = new Array<Resource>();

  schemas = new Schemas();

  http: HttpProtocol = new HttpProtocol();

  constructor() {
    (<any>this.#project).api = this;
  }

  versionInfo = new Array<VersionInfo>();

  attic?: Attic;

  addInternalData(key: string, internalData: InternalData): void {
    // ...
  }

  async saveADL(path: string, cleanDirectory = true) {
    // save any open files to memory
    await this.project.save();

    // remove folder if required
    if (await exists(path)) {
      if (await isFile(path)) {
        throw Error('Target path is a file.');
      }
      if (cleanDirectory) {
        await rmdir(path);
      }
    }

    // ensure folder is created 
    await mkdir(path);

    const format = {
      indentSize: 1,
    };
    // print each file and save it.
    return (await Promise.all(
      this.project.getSourceFiles().map(async (each) => {
        if (this.isFileAnonymous(each)) {
          return;
        }
        // disabled: format/organize imports
        // each.formatText(format);
        // each.organizeImports(format);

        const filename = join(path, each.getFilePath());

        const folder = dirname(filename);
        await mkdir(folder);

        await writeFile(filename, each.print().
          //replace(/\*\/\s*\/\*\*\s*/g, '').
          replace(/^(\s*\/\*)/g, '\n$1')
        );
      }))).length;
  }

  getNode(path: Path): Node | undefined {
    return getNode(path, this.project);
  }

  getFile(identity: Identity, type: keyof Folders ): SourceFile {
    if (isAnonymous(identity) ) {
      identity = identity.name;
      type = 'anonymous';
    }
    const filename = `${(<string>identity).replace(/[^\w]+/g, '_')}.ts`;
    return this.#folders[type].getSourceFile(filename) || this.#folders[type].createSourceFile(filename);
  }

  getEnum(name: string) {
    name = valueOf(name);
    let result: EnumDeclaration | undefined;

    for (const file of this.project.getSourceFiles()) {
      const result = file.getEnum(name);
      if (result) {
        return referenceTo(result);
      }
    }
    return undefined;
  }

  isFileAnonymous(sourceFile: SourceFile): boolean {
    return this.#folders.anonymous.isAncestorOf(sourceFile);
  }

  getNameAndFile(identity: Identity, type: keyof Folders) {
    const name = isAnonymous(identity) ? `${type}_${this.counter++}` : <string><any>valueOf(identity).replace(/[^\w]+/g, '_');
    const file = isAnonymous(identity) ? this.getFile(name,'anonymous') : this.getFile(name, type);

    return { name, file };
  } 

  /**
   * Gets a type reference for a given schema.
   * 
   * This also ensures that the types that are required for the schema are imported into the current sourcefile 
   * 
   * @param schema the schema that we need imported.
   */
  getTypeReference(schema: Schema, targetSourceFile: SourceFile): string {
    schema = valueOf(schema);

    // get all the imports required for the type 
    // add them to this file
    const importDecls = targetSourceFile.getImportDeclarations();

    reqdTypes:
    for (const requiredType of schema.requiredTypeDeclarations) {
      if (requiredType.getSourceFile && requiredType.getName ) {
        const typeFile = requiredType.getSourceFile();
        const typeName = requiredType.getName();

        if (typeName === undefined || typeFile === undefined || typeFile === targetSourceFile || this.isFileAnonymous(typeFile)) {
          // don't need to do anything if it's the same file 
          continue;
        }

        for (const importDecl of importDecls) {

          if (importDecl.getModuleSpecifierSourceFile() === typeFile) {
            // we've got imports from that sourcefile 
            if (importDecl.getNamedImports().find(imp => imp.getName() === typeName)) {
              // we've already imported this. Go on to the next one.
              continue reqdTypes;
            }
            
            // we've referenced the file, but not imported the type.
            importDecl.addNamedImport(typeName);
            continue reqdTypes;
          }
          // wasn't in that file
        }
        targetSourceFile.addImportDeclaration({
          moduleSpecifier: targetSourceFile.getRelativePathAsModuleSpecifierTo(typeFile),
          namedImports: [typeName]
        });
      }
    }
    // imported everything we needed. 
    //return schema.node.getName();
    
    return schema.typeDefinition;
  }
}

export class None {
  async __save(): Promise<SerializationResult> {
    throw 'unimplemented';
  }

  /** 
   * creates a duplicate of this API
   */
  async __clone() {
    throw 'unimplemented';
  }

  /**
   * Removes one or more API versions from the API
   *
   * @remarks When an API version is removed, elements that are marked '@since' will be pushed forward to the next API version, unless they are in the last version, at which point, they would be removed. 
   * 
   * @parameter apiVersions -- removes the definitions from this API.
   */
  async __removeVersions() {
    throw 'unimplemented';
  }

  /** 
   * Adds a new API Version to this API 
   * 
   * @param apiVersion - the api version string to add
   */
  async __addVersion() {
    throw 'unimplemented';
  }
}
