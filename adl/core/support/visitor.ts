/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { items, keys, values } from '@azure-tools/linq';
import { common, Dictionary, Info, isReference, isVendorExtension, JsonReference } from '@azure-tools/openapi';
import { anonymous, getSourceFile, isAnonymous, nameOf, Path, refTo, TrackedSource } from '@azure-tools/sourcemap';
import { fail } from 'assert';
import { parse } from 'yaml';
import { Alias } from '../model/alias';
import { ApiModel } from '../model/api-model';
import { Element } from '../model/element';
import { Host } from './file-system';
import { Stopwatch } from './stopwatch';

export interface Options {
  isAnonymous?: boolean;
}

export interface OAIModel {
  info: Info;
}

export interface SourceFile<TSourceModel extends OAIModel> {
  sourceModel: TSourceModel;
  sourceFile: string;
  visitor: Visitor<TSourceModel>;
}

class RefMap {
  private map = new Map<string, Map<string, Array<any>>>();

  get(type: string, ref: string): Array<any> | undefined {
    const map2 = this.map.get(type);
    if (!map2) {
      return undefined;
    }

    const values = map2.get(ref);
    if (!values) {
      return undefined;
    }

    return values;
  }

  set(type: string, ref: string, values: Array<any>): void {
    let map2 = this.map.get(type);
    if (!map2) {
      map2 = new Map<string, Array<any>>();
      this.map.set(type, map2);
    }
    map2.set(ref, values);
  }
}

export class Visitor<TSourceModel extends OAIModel> {
  key = '';
  sourceFiles = new Map<string, Promise<Context<TSourceModel>>>();
  $refs = new RefMap();

  constructor(
    public api: ApiModel,
    public host: Host,
    public inputType: 'oai3' | 'oai2',
    ...sourceFiles: Array<string>) {
    // the source files are going to be YAML/JSON files for this 
    // so we can speed up the process and grab them all and hold onto them
    for (const each of new Set(sourceFiles)) {
      this.sourceFiles.set(this.host.fileSystem.resolve(each), this.loadInput(this.host.fileSystem.resolve(each)));
    }
  }

  async loadInput(sourceFile: string): Promise<Context<TSourceModel>> {

    const watch = new Stopwatch();
    const content = await this.host.fileSystem.readFile(sourceFile);
    this.host.loaded(sourceFile, watch.time);
    const model = parse(content);
    this.host.parsed(sourceFile, watch.time);

    const sourceModel = TrackedSource.track(<TSourceModel>model, model, { sourceFile: { filename: sourceFile }, path: [] });

    return new Context(sourceModel, sourceFile, this);
  }

  async process<TOutput, TOptions extends Options = Options>(action: fnActionOnRoot<TSourceModel, TSourceModel, TOutput, TOptions>) {
    for (const value of values(this.sourceFiles)) {
      const ctx = await value;
      const watch = new Stopwatch();

      await action(<NonNullable<TSourceModel>>ctx.sourceModel, ctx);
      this.host.processed(ctx.sourceFile, watch.time);
    }
    return this.api;
  }

  findNode(path: Path, graph: any): any {
    const [member, ...rest] = path;
    if (member && !isAnonymous(member)) {
      const node = graph[member];
      if (node) {
        return rest.length > 0 ? this.findNode(rest, node) : node;
      }
    }
    throw new Error(`unable to resolve $ref ${path}`);
  }

  async processRef<TInput, TOutput extends Element, TOptions>(sourceFile: string, path: Path, action: fnActionOnRoot<TSourceModel, TInput, TOutput, TOptions>): Promise<Array<TOutput | undefined>> {
    let targetContext = await this.sourceFiles.get(sourceFile);
    if (!targetContext) {
      // the file we're looking for isn't there
      // let's add it to the list as a secondary file
      const t = this.loadInput(sourceFile);
      this.sourceFiles.set(sourceFile, t);
      targetContext = await t;
    }
    const node = this.findNode(path, targetContext.sourceModel);
    if (node) {
      return [await targetContext.processRoot(action, node)];
    }
    throw new Error(`Unable to process Ref ${sourceFile}#/${path}`);
  }

  async *processRef2<TInput, TOutput extends Element, TOptions>(sourceFile: string, path: Path, action: fnAction<TSourceModel, TInput, TOutput, TOptions>): AsyncGenerator<TOutput> {
    let targetContext = await this.sourceFiles.get(sourceFile);
    if (!targetContext) {
      // the file we're looking for isn't there
      // let's add it to the list as a secondary file
      const t = this.loadInput(sourceFile);
      this.sourceFiles.set(sourceFile, t);
      targetContext = await t;
    }
    const node = this.findNode(path, targetContext.sourceModel);
    if (node) {
      yield* targetContext.process(action, node);
      return;
    }
    throw new Error(`Unable to process Ref ${sourceFile}#/${path}`);
  }

  async resolveReference(sourceFile: string, path: Path): Promise<any> {
    let targetContext = await this.sourceFiles.get(sourceFile);
    if (!targetContext) {
      // the file we're looking for isn't there
      // let's add it to the list as a secondary file
      const t = this.loadInput(sourceFile);
      this.sourceFiles.set(sourceFile, t);
      targetContext = await t;
    }
    const node = this.findNode(path, targetContext.sourceModel);
    return node || fail(`Unable to process Ref ${sourceFile}#/${path}`);
  }
}

export type fnActionOnRoot<TSourceModel extends OAIModel, TInput, TOutput, TOptions extends Options> =
  (value: NonNullable<TInput>, context: Context<TSourceModel>, options?: TOptions) => Promise<TOutput | undefined>;

export type fnAction<TSourceModel extends OAIModel, TInput, TOutput, TOptions extends Options> =
  (value: NonNullable<TInput>, context: Context<TSourceModel>, options?: TOptions) => AsyncGenerator<TOutput>;


export class Context<TSourceModel extends OAIModel> {
  constructor(
    public sourceModel: TSourceModel,
    public sourceFile: string,
    public visitor: Visitor<TSourceModel>
  ) {

  }
  get host() {
    return this.visitor.host;
  }
  get apiVersion() {
    return this.sourceModel.info.version;
  }
  error(text: string, offendingNode: any) {
    this.host.error(text, offendingNode);
    return undefined;
  }

  warn(text: string, offendingNode: any) {
    this.host.warning(text, offendingNode);
    return undefined;
  }

  forbiddenProperties<T extends Dictionary<any>>(instance: T, ...properties: Array<keyof T>) {
    let result = false;
    for (const each of keys(instance)) {
      if (properties.indexOf(each) > -1) {
        this.error(`may not contain property ${each}`, instance);
        result = true;
      }
    }
    return result;
  }

  get api() {
    return this.visitor.api;
  }

  async *processArray<TInput, TOutput extends Element, TOptions extends Options>(action: fnAction<TSourceModel, TInput, TOutput, TOptions>, value: Array<TInput> | undefined, options?: TOptions): AsyncGenerator<TOutput> {
    if (value) {
      for (const each of value) {
      
        yield* this.process(action, each);
      }
    }
  }

  async *process<TInput, TOutput extends Element, TOptions extends Options = Options>(action: fnAction<TSourceModel, TInput, TOutput, TOptions>, value: TInput | NonNullable<TInput>, options?: TOptions): AsyncGenerator<TOutput> {
    if (value !== undefined && value !== null) {

      // see if we've processed this node before.
      // todo: hmmm. $refs can only return a single value? This may need rethinking...
      const ref = refTo(value);
      const refResult = this.visitor.$refs.get(action.name, ref);
      if (refResult) {
        for (const each of refResult) {
          yield each;
        }
        return;
      }

      const results = new Array<TOutput>();
      // ok, call the action
      for await (const result of action(value!, this, options)) {
        if (result !== undefined) {
          // we got back a value for that.

          // track it so we don't redo it if asked for it again later.
          this.visitor.$refs.set(action.name, ref, results);
          results.push(result);
          if (result.versionInfo.length === 0) {
            // only add this if we haven't added it before
            // when a result is returned up the chain more than once
            result.addVersionInfo({
              // deprecated isn't on everything, but this is safe when it's not there
              deprecated: (<any>value).deprecated ? this.apiVersion : undefined,
              added: this.apiVersion,
            });
            result.addInternalData(this.visitor.inputType, { preferredFile: getSourceFile(value) });
          }

          yield result;
        }
      }
    }
  }

  addVersionInfo(result: any, value: any) {
    // 
    if (result.versionInfo.length === 0) {
      // only add this if we haven't added it before
      // when a result is returned up the chain more than once
      result.addVersionInfo({
        // deprecated isn't on everything, but this is safe when it's not there
        deprecated: (<any>value).deprecated ? this.apiVersion : undefined,
        added: this.apiVersion,
      });
      result.addInternalData(this.visitor.inputType, { preferredFile: getSourceFile(value) });
    }
  }

  async resolveReference(reference: string)  {
    const {file, path } = this.normalizeReference(reference); 
    return this.visitor.resolveReference(file,path);
  }

  async *processInline<TIn, TOut extends Element, TOptions extends Options = Options>(action: fnAction<TSourceModel, TIn, TOut, TOptions>, value: TIn | common.JsonReference<TIn> | undefined, options?: TOptions): AsyncGenerator<TOut | Alias<TOut>> {
    if (value !== undefined) {
      if (isReference(value)) {
        const name = options?.isAnonymous ? anonymous(action.name) : nameOf(value);

        const { $ref, file, path } = this.normalizeReference(value.$ref);

        const targets = <Array<TOut>>this.visitor.$refs.get(action.name, $ref);
        if (targets) {
          // already processed?
          for (const target of targets) {
            // if this is a direct link to the target, we return it as-is
            // otherwise it's got a name, so we're creating an alias to the actual target 

            yield options?.isAnonymous ? target : new Alias(action.name, name, target);
          }
          return;
        }

        // nope, this will process them
        for await (const target of this.visitor.processRef2(file, path, action)) {
          // if this is a direct link to the target, we return it as-is
          // otherwise it's got a name, so we're creating an alias to the actual target 
          yield options?.isAnonymous ? target : new Alias(action.name, name, target);
        }
        return;
      }
      // if we came to processInline, then that means 
      // by defintion, we are processing an anonymous element.
      yield* this.process(action, <TIn>value, <TOptions>{ ...options, isAnonymous: true });
    }
  }

  async *processDictionary<TInput, TOutput extends Element, TOptions extends Options>(action: fnAction<TSourceModel, TInput, TOutput, TOptions>, dictionary: Dictionary<TInput | JsonReference<TInput>> | undefined, options?: TOptions): AsyncGenerator<TOutput | Alias<TOutput>> {
    for (const [key, value] of items(dictionary)) {
      if (isVendorExtension(key)) {
        continue;
      }
      yield* isReference(value) ? this.processInline<TInput, TOutput, TOptions>(action, value, options) : this.process(action, value, options);
    }
  }

  async processRoot<TInput, TOutput extends Element, TOptions extends Options>(action: fnActionOnRoot<TSourceModel, TInput, TOutput, TOptions>, value: TInput | NonNullable<TInput>, options?: TOptions): Promise<TOutput | undefined> {

    if (value !== undefined && value !== null) {

      // see if we've processed this node before.
      const ref = refTo(value);
      const results = this.visitor.$refs.get(action.name, ref);
      if (results) {
        return results[0];
      }

      // ok, call the action
      const result = await action(value!, this, options);

      if (result !== undefined) {
        // we got back a value for that.

        // track it so we don't redo it if asked for it again later.
        this.visitor.$refs.set(action.name, ref, [result]);

        result.addVersionInfo({
          // deprecated isn't on everything, but this is safe when it's not there
          deprecated: (<any>value).deprecated ? this.apiVersion: undefined,
          added: this.apiVersion,
        });
        result.addInternalData(this.visitor.inputType, { preferredFile: getSourceFile(value) });

        return result;
      }
    }
    return undefined;
  }

  normalizeReference(ref: string) {
    
    const split = /(.*?)#(.*)/g.exec(ref);
    if (!split) {
      throw new Error(`$ref '${ref}' not legal`);
    }
    // eslint-disable-next-line prefer-const
    let [, file, path] = split;
    if (path.startsWith('/')) {
      path = path.substr(1);
    }
    // is the file pointing to this file?
    if (file === '' || file === '.' || file === './') {
      // file = getSourceFile(ref)?.filename || fail(`unable to get filename of $ref ${ref}`);
      file = this.sourceFile;
    } else {
      file = this.visitor.host.fileSystem.resolve(file);
    }

    return {
      file: file,
      path: path.split('/'),
      $ref: `${file}#${path}`,
    };
  }
}
