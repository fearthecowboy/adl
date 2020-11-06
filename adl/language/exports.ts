export class ClassDeclaration { }
export class EnumDeclaration { }
export class EnumMember { }
export class InterfaceDeclaration { }
export class Node { }
export class SyntaxList { }
export class Project { }
export class TypeAliasDeclaration { }
export class TypeParameterDeclaration { }
export class TypeNode<T = any> { }
export class TypeReferenceNode { }
export class UnionTypeNode { }
export class JSDocableNode { }
export class Directory { }

export interface ImportDeclarationStructure { }
export function printNode(node: /*ts.Node*/any, options?: PrintNodeOptions): string {
  throw new Error('Not Implemented');
}

export enum NewLineKind {
  CarriageReturnLineFeed = 0,
  LineFeed = 1
}

export enum EmitHint {
  SourceFile = 0,
  Expression = 1,
  IdentifierName = 2,
  MappedTypeParameter = 3,
  Unspecified = 4,
  EmbeddedStatement = 5,
  JsxAttributeValue = 6
}


export enum StructureKind {
  CallSignature = 0,
  Class = 1,
  ConstructSignature = 2,
  Constructor = 3,
  ConstructorOverload = 4,
  Decorator = 5,
  Enum = 6,
  EnumMember = 7,
  ExportAssignment = 8,
  ExportDeclaration = 9,
  ExportSpecifier = 10,
  Function = 11,
  FunctionOverload = 12,
  GetAccessor = 13,
  ImportDeclaration = 14,
  ImportSpecifier = 15,
  IndexSignature = 16,
  Interface = 17,
  JsxAttribute = 18,
  JsxSpreadAttribute = 19,
  JsxElement = 20,
  JsxSelfClosingElement = 21,
  JSDoc = 22,
  JSDocTag = 23,
  Method = 24,
  MethodOverload = 25,
  MethodSignature = 26,
  Namespace = 27,
  Parameter = 28,
  Property = 29,
  PropertyAssignment = 30,
  PropertySignature = 31,
  SetAccessor = 32,
  ShorthandPropertyAssignment = 33,
  SourceFile = 34,
  SpreadAssignment = 35,
  TypeAlias = 36,
  TypeParameter = 37,
  VariableDeclaration = 38,
  VariableStatement = 39
}

/** Options for printing a node. */
export interface PrintNodeOptions {
  /** Whether to remove comments or not. */
  removeComments?: boolean;
  /**
   * New line kind.
   *
   * Defaults to line feed.
   */
  newLineKind?: NewLineKind;
  /**
   * From the compiler api: "A value indicating the purpose of a node. This is primarily used to
   * distinguish between an `Identifier` used in an expression position, versus an
   * `Identifier` used as an `IdentifierName` as part of a declaration. For most nodes you
   * should just pass `Unspecified`."
   *
   * Defaults to `Unspecified`.
   */
  emitHint?: EmitHint;
}

/** Kinds of indentation */
export declare enum IndentationText {
  /** Two spaces */
  TwoSpaces = '  ',
  /** Four spaces */
  FourSpaces = '    ',
  /** Eight spaces */
  EightSpaces = '        ',
  /** Tab */
  Tab = '\t'
}

/** Quote type for a string literal. */
export declare enum QuoteKind {
  /** Single quote */
  Single = '\'',
  /** Double quote */
  Double = '"'
}

export class JSDocTag { }

export enum SyntaxKind {

}

export class MethodSignature { }

export class ParameterDeclaration { }

export class TypeLiteralNode { }

export interface JSDocTagStructure { }

export interface MethodSignatureStructure { }

export namespace ts {

}

export class TupleTypeNode { }


export interface ParameterDeclarationStructure { }

export class FunctionTypeNode { }
export class PropertySignature { }
export interface PropertySignatureStructure { }
export interface TypeParameterDeclarationStructure { }
export interface JSDocStructure { }
export class JSDoc { }

export class QuestionTokenableNode { }


export class TypedNode { }
export class BindingName { }
export class Identifier { }
export class NamedNodeSpecificBase<T = any> { }
export class PropertyName { }
export class ReferenceFindableNode { }
export class RenameableNode { }