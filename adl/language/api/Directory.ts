import { SourceFile } from './SourceFile';


export class Directory {
  /**
  * Creates a source file at the specified file path with the specified text.
  *
  * Note: The file will not be created and saved to the file system until .save() is called on the source file.
  * @param filePath - File path of the source file.
  * @param sourceFileText - Text, structure, or writer function for the source file text.
  */
  createSourceFile(relativeFilePath: string, sourceFileText?: string): SourceFile {
    throw new Error('Not Implemented');
  }

  /**
     * Creates a directory at the specified path.
     * @param dirPath - Path to create the directory at.
     */
  createDirectory(dirPath: string): Directory {
    throw new Error('Not Implemented');
  }

  /** Gets the child directories. */
  getDirectories(): Array<Directory> {
    throw new Error('Not Implemented');
  }
  /** Gets the source files within this directory. */
  getSourceFiles(): Array<SourceFile> {
    throw new Error('Not Implemented');
  }
}
