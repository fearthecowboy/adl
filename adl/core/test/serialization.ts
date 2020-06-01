import { linq } from '@azure-tools/linq';
import { isAnonymous } from '@azure-tools/sourcemap';
import { AST, CST, Document } from 'yaml';
import { Schema, YAMLMap } from 'yaml/types';
import { parseMap } from 'yaml/util';
import { ApiModel } from '../model/api-model';
import { Element, TSElement } from '../model/element';

const propertyPriority = [
  'type',
  'name',

  'primitives',
];

const propertyNegativePriority = [
  'versionInfo',
  'aliases',
  'attic'
];

function sortWithPriorty(a: any, b: any): number {
  if (a == b) {
    return 0;
  }
  const ia = propertyPriority.indexOf(a);
  const ib = propertyPriority.indexOf(b);
  const na = propertyNegativePriority.indexOf(a);
  const nb = propertyNegativePriority.indexOf(b);

  const dota = `${a}`.startsWith('.');
  const dotb = `${b}`.startsWith('.');

  if (dota) {
    if (!dotb) {
      return 1;
    }
  } else {
    if (dotb) {
      return -1;
    }
  }

  if (na > -1) {
    if (nb > -1) {
      return na - nb;
    }
    return 1;
  }

  if (nb > -1) {
    return -1;
  }

  if (ia != -1) {
    return ib != -1 ? ia - ib : -1;
  }

  return ib != -1 || a > b ? 1 : a < b ? -1 : 0;
}

export const elementTag = <Schema.CustomTag>{
  identify: (v: any) => 
    v !== undefined && 
    v !== null && 
    typeof v === 'object' && 
    !Array.isArray(v) && 
    (v instanceof ApiModel || v instanceof Element || v.added),
  default: true,
  tag: 'tag:yaml.org,2002:map',
  resolve: (doc: Document, cst: CST.Node): AST.Node => {
    const map = parseMap(doc, <any>cst);
    return Object.assign(new Element(), map);
  },
  createNode: (schema: Schema, value: any, ctx: Schema.CreateNodeContext) => {
    const sch = <any>schema;
    const s = <any>(YAMLMap);
    const y = new s(schema);

    for (const key of linq.keys(value).toArray().sort(sortWithPriorty)) {

      let v = value[<any>key];
      // don't serialize undefined/null/''/functions
      if (v === undefined || v === null || typeof v === 'function' || v === '') {
        continue;
      }
      if (v instanceof TSElement) {
        continue;
      }

      if (isAnonymous(v)) {
        v = v.name;
      }
      if( typeof key === 'string' && key.startsWith('_')){
        continue;
      }
      
      switch (key) {
        // temporary -- this is just noisy while we only have one version to play with.
        case 'versionInfo':
        case 'internalData':
        case 'node':
          continue;
      }

      // skip empty arrays
      if ((Array.isArray(v) && v.length === 0)) {
        continue;
      }

      if (v instanceof Promise) {
        throw new Error(`Property ${key} is a Promise. Missing an await?`);
      }

      // use createPair (which uses createNode, and ensures that anchors work)
      y.add(sch.createPair(key, v, ctx));
    }

    // todo: see how we can override the anchor name if possible.
    // if (ctx.prevObjects && ctx.prevObjects.get(value)) {
    // console.log(ctx.prevObjects.get(value));
    // ctx.prevObjects.set(value, `AA${ctx.prevObjects.get(value)}`);
    //}
    return y;
  }
};

export function serialize(instance: any) {
  return 'not right now';
  //return stringify(instance, { customTags: [elementTag] }).
  //   replace(/:$\s*(&a\d*)/gm, ': $1'); // put anchor on declaration line. 
}
