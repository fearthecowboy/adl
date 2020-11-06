import { SourceFile } from '../api/SourceFile';
import { Statements } from '../api/Statements';
import { TokenCursor } from './cursor';

export function parse(sourceFileText: string, sourceFileName: string): SourceFile;
export function parse(sourceFile: SourceFile): SourceFile
export function parse(sourceFileOrText: string | SourceFile, sourceFileName?: string): SourceFile {
  if (typeof sourceFileOrText === 'string') {
    const sf = new SourceFile();
    sf.text = sourceFileOrText;
    sf.name = sourceFileName!;
    return process(new TokenCursor(sf));
  }
  return process(new TokenCursor(sourceFileOrText));
}

function process(cursor: TokenCursor) {
  const sourceFile = cursor.sourceFile;
  // drop the current set of statements
  sourceFile.reset();
  cursor.scan();

  // parse the statements in this file
  for (const statement of Statements.parse(cursor)) {
    sourceFile.push(statement);
  }

  sourceFile.end = cursor.offset;

  return sourceFile;
}