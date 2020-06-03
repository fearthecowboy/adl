import { anonymous } from '@azure-tools/sourcemap';
import { Directory } from 'ts-morph';

export type Identity = string | anonymous;

export type URL = string;

export interface ReadOnlyCollection<T> {
  get(): Array<T>;
}

export interface Collection<T> extends ReadOnlyCollection<T> {
  push(...values: Array<T>): void;
  remove(value: T): void;
}

export class ReadOnlyCollectionImpl<TCollectionType, TOwner> implements ReadOnlyCollection<TCollectionType> {
  constructor(owner: TOwner,
    public readonly get: () => Array<TCollectionType>) {

    this.get = get.bind(owner);
  }
}

export class CollectionImpl<TCollectionType, TOwner> implements Collection<TCollectionType> {
  constructor(owner: TOwner, 
    public readonly push: (...values: Array<TCollectionType>) => void,
    public readonly remove: (value: TCollectionType) => void,
    public readonly get: () => Array<TCollectionType>
  ) {
    const notImplemented = () => { throw new Error('not implemented'); };
    this.push =  push?.bind(owner) ?? notImplemented;
    this.remove = remove?.bind(owner) ?? notImplemented;
    this.get = get?.bind(owner) ?? notImplemented;
  }
}

export class ArrayCollectionImpl<T> implements Collection<T> {
  #array = new Array<T>();
  push(...values: Array<T>): void {
    this.#array.push(...values);
  }
  remove(value: T): void {
    throw new Error('not implemented.');
  }
  get(): Array<T> {
    return [...this.#array];
  }
}


export interface Folders {
  anonymous: Directory;
  alias: Directory;
  model: Directory;
  enum: Directory;
  group: Directory;
  resource: Directory;
}

export interface FileInfo {
  filename: string;
}

export type Version = string;
