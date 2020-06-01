import { fail } from 'assert';
import { JSDoc, JSDocTag, Node } from 'ts-morph';


export type JSDocs = Array<JSDoc>;

export function getDocs(target: Node | JSDocs | JSDoc) {
  return Array.isArray(target) ? target : 
    Node.isJSDoc(target) ? [target] : 
      Node.isJSDocableNode(target) ? target.getJsDocs().filter(each => !!each) : 
        fail('Node is not a docable node');
}

export function getFirstDoc(target: Node | JSDocs | JSDoc): JSDoc {
  const docs = getDocs(target);
  return docs.length > 0 ? docs[0]:( Node.isJSDocableNode(<any>target) ? (<any>target).addJsDoc('\n') : fail('Node is not a docable node'));
}

export function getLastDoc(target: Node | JSDocs | JSDoc): JSDoc{
  const docs = getDocs(target);
  return docs.length > 0 ? docs[docs.length - 1] : (Node.isJSDocableNode(<any>target) ? (<any>target).addJsDoc('\n') : fail('Node is not a docable node'));
}

export function *getTags(target: Node|JSDocs|JSDoc, tagName? : string ): Iterable<JSDocTag> {
  for( const each of getDocs(target) )  {
    yield * (tagName? each.getTags().filter( tag => tag.getTagName() == tagName) : each.getTags());
  }
}

export function getTagValue(target: Node | JSDocs | JSDoc, tagName: string): string|undefined {
  for( const each of getTagValues( target, tagName)) {
    return each;
  }
  return undefined;
}

export function* getTagValues(target: Node | JSDocs | JSDoc, tagName? : string): Iterable<string> {
  for( const each of getTags(target,tagName)) {
    yield each.getText() || '';
  } 
}

export function hasTag(target: Node | JSDocs | JSDoc, tagName: string ) {
  for( const each of getTags(target, tagName) ) {
    return true;
  }
  return false;
}

export function appendTag(target: Node | JSDocs | JSDoc, tagName: string, text?: string ) {
  getLastDoc(target).addTag({
    tagName, 
    text
  });
}

export function prependTag(target: Node | JSDocs | JSDoc, tagName: string, text?: string) {
  getFirstDoc(target).insertTag(0,{
    tagName,
    text
  });
}

export function removeTag(target: Node | JSDocs | JSDoc, tagName: string ) {
  // todo: investigate if this is ok -- does removing tags from from the source file reset the nodes in the sourcefile? 
  if( tagName ) {
    for (const tag of getTags(target, tagName)) {
      tag.remove();
    }
  }
}

export function setTag( target: Node | JSDoc| JSDocs, tagName: string,text?: string|boolean ) {
  removeTag(target, tagName);
  switch( text ) {
    case undefined:
    case false:
      break;
    case true:
      // true values are assumed when the tag is present.
      text = undefined;  
    // eslint-disable-next-line no-fallthrough
    default:
      appendTag(target, tagName, text);
      break;
  }
}
