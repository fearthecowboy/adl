import { Directory } from './Directory';
import { SourceFile } from './SourceFile';

// Project

export class Project {
  /**
 * Creates a directory at the specified path.
 * @param dirPath - Path to create the directory at.
 */
  createDirectory(dirPath: string): Directory {
    throw new Error('Not Implemented');
  }

  /**
    * Gets a directory by the specified path or returns undefined if it doesn't exist.
    * @param dirPath - Directory path.
    */
  getDirectory(dirPath: string): Directory | undefined {
    return undefined;
  }

  getDirectories(): Array<Directory> {
    throw new Error('Not Implemented');
  }

  /** Gets all the source files added to the project. */
  getSourceFiles(): Array<SourceFile> {
    throw new Error('Not Implemented');
  }
}
