/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IndexOf, Dictionary } from './common';

export interface Linqed<T> extends Iterable<T> {
  any(predicate?: (each: T) => boolean): boolean;
  all(predicate: (each: T) => boolean): boolean;
  bifurcate(predicate: (each: T) => boolean): Array<Array<T>>;
  concat(more: Iterable<T>): Linqable<T>;
  distinct(selector?: (each: T) => any): Linqable<T>;
  first(predicate?: (each: T) => boolean): T | undefined;
  selectNonNullable<V>(selector: (each: T) => V): Linqable<NonNullable<V>>;
  select<V>(selector: (each: T) => V): Linqable<V>;
  selectMany<V>(selector: (each: T) => Iterable<V>): Linqable<V>;
  where(predicate: (each: T) => boolean): Linqable<T>;
  forEach(action: (each: T) => void): void;
  aggregate<A, R>(accumulator: (current: T | A, next: T) => A, seed?: T | A, resultAction?: (result?: T | A) => A | R): T | A | R | undefined;
  toArray(): Array<T>;
}

export interface Linqable<T> extends Iterable<T> {
  linq: {
    any(predicate?: (each: T) => boolean): boolean;
    all(predicate: (each: T) => boolean): boolean;
    bifurcate(predicate: (each: T) => boolean): Array<Array<T>>;
    concat(more: Iterable<T>): Linqable<T>;
    distinct(selector?: (each: T) => any): Linqable<T>;
    first(predicate?: (each: T) => boolean): T | undefined;
    selectNonNullable<V>(selector: (each: T) => V): Linqable<NonNullable<V>>;
    select<V>(selector: (each: T) => V): Linqable<V>;
    selectMany<V>(selector: (each: T) => Iterable<V>): Linqable<V>;
    where(predicate: (each: T) => boolean): Linqable<T>;
    forEach(action: (each: T) => void): void;
    aggregate<A, R>(accumulator: (current: T | A, next: T) => A, seed?: T | A, resultAction?: (result?: T | A) => A | R): T | A | R | undefined;
    toArray(): Array<T>;
  };
}
/* eslint-disable */

function enlinq<T>(iterable: Iterable<T>): Linqed<T> {
  return {
    ...iterable,
    all: <any>all.bind(iterable),
    any: <any>any.bind(iterable),
    bifurcate: <any>bifurcate.bind(iterable),
    concat: <any>concat.bind(iterable),
    distinct: <any>distinct.bind(iterable),
    first: <any>first.bind(iterable),
    select: <any>select.bind(iterable),
    selectMany: <any>selectMany.bind(iterable),
    selectNonNullable: <any>selectNonNullable.bind(iterable),
    toArray: <any>toArray.bind(iterable),
    where: <any>where.bind(iterable),
    forEach: <any>forEach.bind(iterable),
    aggregate: <any>aggregate.bind(iterable),
  };
}

function linqify<T>(iterable: Iterable<T>): Linqable<T> {
  if ((<any>iterable)['linq']) {
    return <Linqable<T>>iterable;
  }
  return Object.defineProperty(iterable, 'linq', {
    get: () => {
      return {
        all: all.bind(iterable),
        any: any.bind(iterable),
        bifurcate: bifurcate.bind(iterable),
        concat: concat.bind(iterable),
        distinct: distinct.bind(iterable),
        first: first.bind(iterable),
        select: select.bind(iterable),
        selectMany: selectMany.bind(iterable),
        selectNonNullable: selectNonNullable.bind(iterable),
        toArray: toArray.bind(iterable),
        where: where.bind(iterable),
        forEach: forEach.bind(iterable),
        aggregate: aggregate.bind(iterable),
      };
    }
  });
}

/** returns an Linqable<> for keys in the collection */
export function keys<K, T, TSrc extends (Array<T> | Dictionary<T> | Map<K, T>)>(source: TSrc & (Array<T> | Dictionary<T> | Map<K, T>) | null | undefined): Linqable<IndexOf<TSrc>> {
  if (source) {
    if (Array.isArray(source)) {
      return <Linqable<IndexOf<TSrc>>>linqify((<Array<T>>source).keys());
    }

    if (source instanceof Map) {
      return <Linqable<IndexOf<TSrc>>><unknown>linqify((<Map<K, T>>source).keys());
    }

    return <Linqable<IndexOf<TSrc>>>linqify((Object.getOwnPropertyNames(source)));
  }
  // undefined/null
  return linqify([]);
}
function isIterable<T>(source: any): source is Iterable<T> {
  return !!source && !!source[Symbol.iterator];
}
/** returns an Linqable<> for values in the collection */
export function values<K, T, TSrc extends (Array<T> | Dictionary<T> | Map<K, T>)>(source: (Iterable<T> | Array<T> | Dictionary<T> | Map<K, T>) | null | undefined): Linqable<T> {
  if (source) {
    // map
    if (source instanceof Map) {
      return linqify(source.values());
    }

    // any iterable source
    if (isIterable(source)) {
      return linqify(source);
    }

    // dictionary (object keys)
    return linqify(function* () {
      for (const key of keys(source)) {
        const value = source[key];
        if (typeof value !== 'function') {
          yield value;
        }
      }
    }());
  }


  // null/undefined
  return linqify([]);
}


/** returns an Linqable<> for values in the collection */
export function evalues<K, T, TSrc extends (Array<T> | Dictionary<T> | Map<K, T>)>(source: (Iterable<T> | Array<T> | Dictionary<T> | Map<K, T>) | null | undefined): Linqed<T> {
  if (source) {
    // map
    if (source instanceof Map) {
      return enlinq(source.values());
    }

    // any iterable source
    if (isIterable(source)) {
      return enlinq(source);
    }

    // dictionary (object keys)
    return enlinq(function* () {
      for (const key of keys(source)) {
        const value = source[key];
        if (typeof value !== 'function') {
          yield value;
        }
      }
    }());
  }


  // null/undefined
  return enlinq([]);
}

/** returns an Linqable<{key,value}> for the Collection */
export function items<K, T, TSrc extends (Array<T> | Dictionary<T> | Map<K, T>)>(source: TSrc & (Array<T> | Dictionary<T> | Map<K, T>) | null | undefined): Linqable<{ key: IndexOf<TSrc>; value: T }> {
  if (source) {
    if (Array.isArray(source)) {
      return <Linqable<{ key: IndexOf<TSrc>; value: T }>>linqify(function* () { for (let i = 0; i < source.length; i++) { yield { key: i, value: source[i] }; } }());
    }

    if (source instanceof Map) {
      return <Linqable<{ key: IndexOf<TSrc>; value: T }>>linqify(function* () { for (const [key, value] of source.entries()) { yield { key, value }; } }());
    }

    return <Linqable<{ key: IndexOf<TSrc>; value: T }>><unknown>linqify(function* () {
      for (const key of keys(source)) {
        const value = source[<string>key];
        if (typeof value !== 'function') {
          yield {
            key, value: source[<string>key]
          };
        }
      }
    }());
  }
  // undefined/null
  return linqify([]);
}

export function length<T, K>(source?: Dictionary<T> | Array<T> | Map<K, T>): number {
  if (source) {
    if (Array.isArray(source)) {
      return source.length;
    }
    if (source instanceof Map) {
      return source.size;
    }
    return source ? Object.getOwnPropertyNames(source).length : 0;
  }
  return 0;
}

export function any<T>(this: Iterable<T>, predicate?: (each: T) => boolean): boolean {
  for (const each of this) {
    if (!predicate || predicate(each)) {
      return true;
    }
  }
  return false;
}

export function all<T>(this: Iterable<T>, predicate: (each: T) => boolean): boolean {
  for (const each of this) {
    if (!predicate(each)) {
      return false;
    }
  }
  return true;
}

export function concat<T>(this: Iterable<T>, more: Iterable<T>): Linqable<T> {
  return linqify(function* (this: Iterable<T>) {
    for (const each of this) {
      yield each;
    }
    for (const each of more) {
      yield each;
    }
  }.bind(this)());
}

export function select<T, V>(this: Iterable<T>, selector: (each: T) => V): Linqable<V> {
  return linqify(function* (this: Iterable<T>) {
    for (const each of this) {
      yield selector(each);
    }
  }.bind(this)());
}

export function selectMany<T, V>(this: Iterable<T>, selector: (each: T) => Iterable<V>): Linqable<V> {
  return linqify(function* (this: Iterable<T>) {
    for (const each of this) {
      for (const item of selector(each)) {
        yield item;
      }
    }
  }.bind(this)());
}

export function where<T>(this: Iterable<T>, predicate: (each: T) => boolean): Linqable<T> {
  return linqify(function* (this: Iterable<T>) {
    for (const each of this) {
      if (predicate(each)) {
        yield each;
      }
    }
  }.bind(this)());
}

export function forEach<T>(this: Iterable<T>, action: (each: T) => void) {
  for (const each of this) {
    action(each);
  }
}

export function aggregate<T, A, R>(this: Iterable<T>, accumulator: (current: T | A, next: T) => A, seed?: T | A, resultAction?: (result?: T | A) => A | R): T | A | R | undefined {
  let result: T | A | undefined = seed;
  for (const each of this) {
    if (result === undefined) {
      result = each;
      continue;
    }
    result = accumulator(result, each);
  }
  return resultAction !== undefined ? resultAction(result) : result;
}

export function selectNonNullable<T, V>(this: Iterable<T>, selector: (each: T) => V): Linqable<NonNullable<V>> {
  return linqify(function* (this: Iterable<T>) {
    for (const each of this) {
      const value = selector(each);
      if (value) {
        yield <NonNullable<V>><any>value;
      }
    }
  }.bind(this)());
}

export function nonNullable<T>(this: Iterable<T>): Linqable<NonNullable<T>> {
  return linqify(function* (this: Iterable<T>) {
    for (const each of this) {
      if (each) {
        yield <NonNullable<T>><any>each;
      }
    }
  }.bind(this)());
}

export function first<T>(this: Iterable<T>, predicate?: (each: T) => boolean): T | undefined {
  for (const each of this) {
    if (!predicate || predicate(each)) {
      return each;
    }
  }
  return undefined;
}

export function toArray<T>(this: Iterable<T>): Array<T> {
  return [...this];
}

export function bifurcate<T>(this: Iterable<T>, predicate: (each: T) => boolean): Array<Array<T>> {
  const result = [new Array<T>(), new Array<T>()];
  for (const each of this) {
    result[predicate(each) ? 0 : 1].push(each);
  }
  return result;
}

function distinct<T>(this: Iterable<T>, selector?: (each: T) => any): Linqable<T> {
  const hash = new Dictionary<boolean>();
  return linqify(function* (this: Iterable<T>) {

    if (!selector) {
      selector = i => i;
    }
    for (const each of this) {
      const k = JSON.stringify(selector(each));
      if (!hash[k]) {
        hash[k] = true;
        yield each;
      }
    }
  }.bind(this)());
}