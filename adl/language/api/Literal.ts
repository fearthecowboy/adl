import { Kind } from '../compiler/scanner';


export type Literal = Kind.StringLiteral | Kind.NumericLiteral | Kind.TrueKeyword | Kind.FalseKeyword;
