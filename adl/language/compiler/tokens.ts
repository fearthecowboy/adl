import { Element } from '../api/Element';
import { RawToken } from '../api/Token';
import { Kind } from './scanner';

export function isTrivia(token: Kind | { kind: Kind }) {
  switch ((<any>token).kind || token) {
    case Kind.Whitespace:
    case Kind.NewLine:
    case Kind.MultiLineComment:
    case Kind.SingleLineComment:
      return true;
  }
  return false;
}

export function isWhitespace(token: Kind | { kind: Kind }) {
  switch ((<any>token).kind || token) {
    case Kind.Whitespace:
    case Kind.NewLine:
      return true;
  }
  return false;
}

export function isTerminator(token: Kind | { kind: Kind }) {
  switch ((<any>token).kind || token) {
    case Kind.Semicolon:
      return true;
  }
  return false;
}

export function isDocumentation(token: Kind | { kind: Kind }) {
  switch ((<any>token).kind || token) {
    case Kind.Whitespace:
    case Kind.NewLine:
      return true;
  }
  return false;

}

export function isAnnotation(token: Kind | { kind: Kind }) {
  return ((<any>token).kind || token) === Kind.Annotation;
}

export function isIterable(item: any): item is Iterable<any> {
  return !!(typeof item === 'object' && item[Symbol.iterator]);
}

export function isLiteral(token: Kind | { kind: Kind }) {
  switch ((<any>token).kind || token) {
    case Kind.NumericLiteral:
    case Kind.StringLiteral:
    case Kind.TrueKeyword:
    case Kind.FalseKeyword:
      return true;
  }
  return false;
}

export function isElement(token: Kind | { kind: Kind }): token is Element {
  return ((<any>token).kind || token) > Kind.Elements;
}


export function isToken(token: Kind | { kind: Kind }): token is RawToken {
  return ((<any>token).kind || token) < Kind.Elements;
}