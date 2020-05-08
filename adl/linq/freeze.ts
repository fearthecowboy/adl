interface AnyObject {
  [key: string]: any;
  [key: number]: any;
}

export function deepFreeze(instance: object) {
  const obj = <AnyObject>instance;

  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self

  for (const name of propNames) {
    const value = obj[name];

    obj[name] = value && typeof value === 'object' ?
      deepFreeze(value) : value;
  }

  return Object.freeze(obj);
}

function _clone(instance: any, shouldFreeze = false, hash = new WeakMap(), skip: Set<string>, refCopyPropertyNames: Set<string>): any {
  const freeze = shouldFreeze ? Object.freeze : (i: any) => i;
  const obj = <AnyObject>instance;

  if (Object(obj) !== obj) {
    // primitives (no need to clone or freeze)
    return obj;
  }

  if (hash.has(obj)) {
    // cyclic reference
    return hash.get(obj);
  }

  // Sets must be handled a bit differently
  if (obj instanceof Set) {
    let set = new Set();
    for (const value of obj.values()) {
      set.add(_clone(value, shouldFreeze, hash, skip, refCopyPropertyNames));
    }
    set = freeze(set);
    hash.set(obj, set);
    return set;
  }

  if (Array.isArray(obj)) {
    let array = [];
    for (const value of obj) {
      array.push(_clone(value, shouldFreeze, hash, skip, refCopyPropertyNames));
    }
    array = freeze(array);
    hash.set(obj, array);
    return array;
  }

  // as do Maps
  if (obj instanceof Map) {
    let map = new Map<any, any>();
    Array.from(obj, ([key, val]) => map.set(key, _clone(val, shouldFreeze, hash, skip, refCopyPropertyNames)));
    map = freeze(map);
    hash.set(obj, map);
    return map;
  }

  let result =
    obj instanceof Date ? new Date(obj) :
      obj instanceof RegExp ? new RegExp(obj.source, obj.flags) : {};

  // store it to prevent cyclic reference failures
  hash.set(obj, result);


  // recurse thru children
  for (const each of Object.keys(obj)) {
    if (skip.has(each)) {
      continue;
    }
    if (refCopyPropertyNames.has(each)) {
      (<AnyObject>result)[each] = obj[each];
    } else {
      (<AnyObject>result)[each] = _clone(obj[each], shouldFreeze, hash, skip, refCopyPropertyNames);
    }

  }
  // Object.assign(result, ...Object.keys(obj).filter(key => skip.indexOf(key) === -1).map(key => refCopyPropertyNames.indexOf(key) > -1 ? ({ [key]: obj[key] }) : ({ [key]: clone(obj[key], shouldFreeze, hash, skip, refCopyPropertyNames) })));

  // freeze it if necessary
  result = freeze(result);

  return result;
}


export function clone(instance: any, shouldFreeze = false, hash = new WeakMap(), skip: Array<string> = [], refCopyPropertyNames: Array<string> = []): any {
  return _clone(instance, shouldFreeze, hash, new Set(skip), new Set(refCopyPropertyNames));
}