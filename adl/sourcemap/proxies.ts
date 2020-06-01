/* eslint-disable @typescript-eslint/ban-types */
import { items, linq } from '@azure-tools/linq';
import { Path, Tracker } from './exports';


// eslint-disable-next-line no-prototype-builtins
if (!Array.prototype.hasOwnProperty('last')) {
  Object.defineProperty(Array.prototype, 'last', {
    get() {
      return this[this.length - 1];
    }
  });
}
export interface SourceFile {
  filename: string;
}

export interface Origin {
  sourceFile: SourceFile;
  path: Path;
}

enum SpecialProperties {
  Origin = '##Origin', // the source path from whence the object came.
  Destination = '##Destination', // the target path to a trackedTarget object
  OnAdd = '$onAdd', // a hidden function that can bind an object to the parent.
  valueOf = 'valueOf', // a backdoor to get the actual un-proxied value. 
  toString = 'toString', // ensure that toString works on proxy'd primitives 
  ActualValue = '##actualValue',  // another backdoor
  Tracker = '##Tracker', // instance of the tracker that this object is bound to.
  IsSourceProxy = '##IsSourceProxy', // lets us know if we're in a proxy
  IsTargetProxy = '##IsTargetProxy', // lets us know if we're in a proxy
  IsUsed = '##IsUsed', // tags the property as 'used'
  RefToHere = '##RefToHere', // gets the JSON Reference to the tracked source
}

/** marks a member in a tracked source model as 'used' */
export function use<T>(value: T, recursive = false): T {
  if (value === undefined || value === null || typeof value === 'function') {
    return value;
  }

  if ((<any>value)[SpecialProperties.IsSourceProxy]) {
    (<any>value)[SpecialProperties.IsUsed] = true;

    if (recursive && typeof valueOf(value) === 'object') {
      for (const each of Object.values(value)) {
        use(each, true);
      }
    }
  }

  return value;
}

export function unusedMembers<T>(value: T) {
  if (value === undefined || value === null || typeof valueOf(value) !== 'object') {
    return [];
  }

  return linq.items(<any>value).where((each) => !isUsed(each[1])).select(each => each[0]).toArray();
}

export function isProxy<T>(value: T) {
  return (value !== undefined && value !== null && typeof value === 'object') && ((<any>value)[SpecialProperties.IsSourceProxy] === true || (<any>value)[SpecialProperties.IsTargetProxy] === true);
}

export function isActualValue(value: any) {
  return value === undefined || value === null || typeof value !== 'object' || valueOf(value) !== value;
}
export function valueOf<T>(value: T): T {
  if (value === undefined || value === null || typeof value !== 'object') {
    return value;
  }
  const v = (<any>value).valueOf();
  return v !== value ? valueOf(v) : v;
}

export function isSourceProxy<T>(value: T) {
  if (value === undefined || value === null || typeof value !== 'object') {
    return false;
  }
  return (<any>value)[SpecialProperties.IsSourceProxy] === true;
}

export function isTargetProxy<T>(value: T) {
  if (value === undefined || value === null || typeof value !== 'object') {
    return false;
  }
  return (<any>value)[SpecialProperties.IsTargetProxy] === true;
}

export function isUsed<T>(value: T): boolean {
  // only proxies have isUsed info
  // (so, null/undefined/bool/string/number are 'used' )
  if (!isSourceProxy(value)) {
    return true;
  }
  // ask the proxy if the isUsed is set.
  /// return (<any>value)[SpecialProperties.IsUsed] === true;
  return true;
}

export function getSourceFile(value: any): SourceFile | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value[SpecialProperties.Origin]?.sourceFile;
}

export function nameOf(value: any) {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value[SpecialProperties.Origin]?.path.last;
}

export function refTo(value: any): string {
  if (value === undefined || value === null) {
    return '';
  }
  return value[SpecialProperties.RefToHere];
}

export function using<T>(sourceValue: any, actualTargetValue: T): T | undefined {
  if (actualTargetValue === undefined || actualTargetValue === null) {
    return undefined;
  }
  if (sourceValue === undefined || sourceValue === null) {
    return undefined;
  }
  use(sourceValue);

  const origin = sourceValue[SpecialProperties.Origin];
  if (origin) {
    return <T>TrackedSource.track(typeof actualTargetValue === 'object' ? actualTargetValue : new Object(actualTargetValue), actualTargetValue, origin);
  }

  // todo: sourceValue wasn't a tracked value? is this an error? 
  return actualTargetValue;
}

function getProxy(instance: any) {
  if (instance === undefined || instance === null || typeof instance !== 'object' || isProxy(instance)) {
    return instance;
  }
  return TrackedSource.registry.get(instance) || TrackedTarget.registry.get(instance) || instance;
}

export class TrackedSource<T extends Object, instanceType> {
  static registry = new WeakMap<Object, Object>();
  private constructor(private wrappedInstance: T, private instance: instanceType, private origin: Origin, private parent?: TrackedSource<any, any>) {

  }
  static track<T extends Object, instanceType>(wrappedInstance: T, instance: instanceType, origin: Origin, parent?: TrackedSource<any, any>): T {
    let result = <TrackedSource<T, instanceType> | undefined>TrackedSource.registry.get(wrappedInstance);
    if (result === undefined) {
      result = new TrackedSource(wrappedInstance, instance, origin, parent);
      result.proxy = new Proxy(wrappedInstance, result);
      TrackedSource.registry.set(wrappedInstance, result);
    }
    return result?.proxy;
  }
  proxy!: T;
  isUsed?: boolean;
  trackedChildren?: any;

  /**
   * returns true if the property exists
   * 
   * @param actual the actual instance being proxied
   * @param property the property requested
   */
  has(actual: T, property: PropertyKey): boolean {
    switch (property) {
      case SpecialProperties.OnAdd:
      case SpecialProperties.IsUsed:
      case SpecialProperties.Origin:
      case SpecialProperties.IsSourceProxy:
      case SpecialProperties.ActualValue:
      case SpecialProperties.valueOf:
      case SpecialProperties.toString:
      case SpecialProperties.RefToHere:
        return true;
    }
    return property in this.instance;
  }

  /**
   * Handles property set on the proxy 
   * 
   * We override this to provide a virtual property for isUsed
   * 
   * @param actual the actual object being proxied
   * @param property the property being written to
   * @param value the value to write to the object
   */
  set(actual: T, property: keyof T, value: any): boolean {
    switch (property) {
      case SpecialProperties.IsUsed:
        // setting the IsUsed value always assumes you're setting IsUsed = true.
        // we don't allow you to unset the isUsed flag.

        // don't recheck if we're already used.
        if (this.isUsed) {
          return true;
        }

        // if the actual value isn't an object then we can just set the isUsed flag.
        if (typeof valueOf(this.instance) !== 'object') {
          this.isUsed = true;
        } else {
          // if we have children, the final state of isUsed is dependent on all them being used.
          // this check only happens if we set an object to used and 
          this.isUsed = linq.values(<any>this.proxy).all(each =>isUsed(each));
        }

        // if the parent has been marked as used (ie, 'false')
        // then tell the parent to finally check if all it's children are used up.
        if (this.parent && this.parent.isUsed === false) {
          (<any>this.parent.proxy)[SpecialProperties.IsUsed] = true;
        }
        return true;
    }

    // delegate back to the original object
    (<any>this.instance)[property] = value;
    return true;
  }

  /**
   * On being added to a target model, the sourceTracker will ask this to record the location
   * 
   * @param tracker the source tracker instance 
   * @param pathInTarget the path in the target that the value of this property is being assigned to
   * @param propertyValue the property value being assigned.
   */
  onAdd(tracker: Tracker, pathInTarget: Path) {
    if (tracker) {
      // if the tracker is set, then that means there is a path 
      // all the way from the target model root to the location that
      // this property is being set
      tracker.add(pathInTarget, this.origin);
    }
  }

  /**
   * Handles property get for the proxy
   * 
   * @param actual the actual object being proxies
   * @param property the property requested
   * @param proxy the proxy object (this)
   */
  get(actual: T, property: keyof T, proxy: T): any {
    switch (property) {
      case SpecialProperties.OnAdd:
        return this.onAdd.bind(this);
      case SpecialProperties.Origin:
        return this.origin;
      case SpecialProperties.IsSourceProxy:
        return true;
      case SpecialProperties.ActualValue:
        return valueOf(this.instance);
      case SpecialProperties.valueOf:
        return () => valueOf(this.instance);
      case SpecialProperties.toString:
        return () => (<any>valueOf(this.instance)).toString();
      case SpecialProperties.RefToHere:
        return `${this.origin.sourceFile.filename}#/${this.origin.path.join('/')}`;
      case SpecialProperties.IsUsed:
        return this.isUsed === true;
    }
    
    const value = (<any>this.instance)[property];
    // if (value === undefined || value === null) {
    if( typeof value !== 'object') {
      return value;
    }
    switch (typeof value) {
      case 'function':
        switch (property) {
          // these functions need to be bound to the actual object 
          // otherwise, they don't work.
          case 'indexOf':
            return (<any>value).bind((<any>this.instance));
        }

        // give back the function, but bind it to the proxy
        // so access can be managed.
        return (<any>value).bind(proxy);

      case 'string':
      case 'boolean':
      case 'number': {
        // primitives.
        // track the child in the tracked children
        // so that the object is consistent
        const tc = <any>(this.trackedChildren = this.trackedChildren || {});
        if (!(property in tc)) {
          tc[property] = TrackedSource.track(new Object(value), value, { ...this.origin, path: [...this.origin.path, property] }, this);
        }
        return tc[property];
      }

      case 'object':
        return TrackedSource.track(value, value, { ...this.origin, path: [...this.origin.path, property] }, this);
    }
    throw new Error('Should not get to here. ');
  }
}

export class TrackedTarget<T extends Object> {
  static registry = new WeakMap<Object, Object>();
  private constructor(private instance: T, private pathInTarget: Path, private tracker?: Tracker) {

  }
  static track<T extends Object>(instance: T, pathInTarget: Path = [], tracker?: Tracker): T {
    let result = <TrackedTarget<T> | undefined>TrackedTarget.registry.get(instance);
    if (result === undefined) {
      result = new TrackedTarget(instance, pathInTarget, tracker);
      result.proxy = new Proxy(instance, result);
      TrackedTarget.registry.set(instance, result);
    }
    return result?.proxy;
  }

  origin?: Origin;
  proxy!: T;
  has(actual: T, property: PropertyKey): boolean {
    switch (property) {
      case SpecialProperties.OnAdd:
      case SpecialProperties.Origin:
      case SpecialProperties.valueOf:
      case SpecialProperties.ActualValue:
      case SpecialProperties.Tracker:
      case SpecialProperties.Destination:
        return true;
    }
    return property in actual;
  }

  onAdd(tracker: Tracker, pathInTarget: Path, cache = new WeakSet()) {
    if( cache.has(this.proxy)) {
      return;
    }
    cache.add(this.proxy);
    // if the tracker for this object is already set, we've 
    // already met the parents and don't need to do it all again
    // (if children get added after, they'll be told to do it then)
    if (tracker && pathInTarget) {
      this.tracker = tracker;
      // if the tracker is set, then we have a path all the way from the root of the target model 
      // to the location that this property is being set.
      if (this.origin) {
        tracker.add(pathInTarget, this.origin);
      }

      // we should recursively call onAdd on the children from here
      // since this might be the first time they meet their parents.
      if (typeof valueOf(this.instance) === 'object') {
        for (const [ key, value ] of items(<any>this.proxy)) {
          if (value === undefined || value === null) {
            continue;
          }

          const rawValue = valueOf((<any>this.instance)[key]);
          if (rawValue !== value) {
            // we've still got the proxy set as the raw value 
            // which means that for certain, the property 
            // hasn't met the parents yet.
            // we need to replace the value in the instance
            // with the raw value (still call onAdd too.)
            (<any>this.instance)[key] = rawValue;
          }
          if( key === 'node') {
            continue;
          }
          // make sure the original value is used
          use(value);

          if (typeof <any>value === 'object') {
            // value could be a TrackedSource or a TrackedTarget (or have $onAdd)
            if ((<any>value).$onAdd) {
              (<any>value).$onAdd(tracker, [...pathInTarget, key], cache);
            }
          }
        }
      }
    }
  }

  get(actual: T, property: keyof T, proxy: T): any {
    switch (property) {
      case SpecialProperties.IsTargetProxy:
        return true;

      case SpecialProperties.OnAdd:
        return this.onAdd.bind(this);

      case SpecialProperties.Origin:
        return this.origin;

      case SpecialProperties.valueOf:
        return () => valueOf(actual);

      case SpecialProperties.toString:
        return () => actual.toString();

      case SpecialProperties.ActualValue:
        return valueOf(actual);

      case SpecialProperties.Tracker:
        return this.tracker;

      case SpecialProperties.Destination:
        return this.pathInTarget;

      case SpecialProperties.IsUsed:
        return undefined;

      case 'project':
      case 'node':
        return (<any>this.instance)[property];        
    }
    const value = actual[property];
    if (value === undefined || value === null) {
      return value;
    }

    switch (typeof value) {
      case 'function':
        return (<any>value).bind(proxy);

      case 'object':
        // if the value we have is already a proxy, return it as-is
        if (isProxy(value)) {
          return value;
        }
        // otherwise, return a proxy for the value;
        return TrackedTarget.track(value, [...this.pathInTarget, property], this.tracker);
    }
    return value;
  }

  set(actual: T, property: keyof T, value: any): boolean {
    switch (property) {
      case SpecialProperties.Tracker:
        this.tracker = value;
        return true;

      case SpecialProperties.Destination:
        this.pathInTarget = value;
        return true;

      case SpecialProperties.Origin:
        if (!value.sourceFile || !value.path) {
          throw new Error('origin not of type Origin');
        }
        this.origin = value;
        return true;

      case SpecialProperties.IsUsed:
        return false;
    }

    // if it's null or undefined, set it 
    if (value === undefined || value === null) {
      actual[property] = value;
      return true;
    }

    const rawValue = valueOf(value);

    // if this isn't a proxied object, and there is one in the registry 
    // for this, let's assume the user passed that in instead.
    if (typeof rawValue === 'object' && !isProxy(value)) {
      value = (<TrackedTarget<T> | undefined>TrackedTarget.registry.get(value))?.proxy ?? typeof value === 'object' ? TrackedTarget.track(value) : value;
    }

    // set the actual value to the actual target value
    try {
      // if it's a sourceProxy we can mark it used
      use(value);

      if (this.tracker) {
        // if we have a tracker, that means that the whole parent
        // is connected, and we can set the actual value.
        actual[property] = rawValue;

        // if the value has an onAdd function
        // we can have that add itself (and any possible children)
        if (value.$onAdd) {
          value.$onAdd(this.tracker, [...this.pathInTarget, property]);
        }

        // and/or

        // does the value know it's origin?
        const origin = <Origin>value[SpecialProperties.Origin];
        if (origin) {
          // if we have the origin of the value
          // we can tell the tracker to track this
          this.tracker.add([...this.pathInTarget, property], origin);
        }

      } else {
        // otherwise, we'd better set the value to the proxy so that 
        // one day we can meet the parents.
        actual[property] = value;
      }

    } catch (E) {
      // I'm not expecting this should get here, but if it does, I need 
      // to know 
      console.error(`Internal failure: Setting a property failed. ${E}`);
    }

    return true;
  }
}

