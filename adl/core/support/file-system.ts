import { ReadUri, ResolveUri } from '@azure-tools/uri';
import { EventEmitter } from 'ee-ts';
import { relative, resolve } from 'path';
import { cwd } from 'process';
import { Stopwatch } from './stopwatch';

interface Events {
  warning(message: string, offendingNode: any, msec: number): void;
  error(message: string, offendingNode: any, msec: number): void;
  loaded(path: string, duration: number, msec: number): void;
  parsed(path: string, duration: number, msec: number): void;
  attic(path: string, duration: number, msec: number): void;
  processed(path: string, duration: number, msec: number): void;
}

export class Host extends EventEmitter<Events> {
  stopwatch = new Stopwatch();
  warning(message: string, offendingNode: any) {
    this.emit('warning', message, offendingNode, this.stopwatch.total);
  }

  error(message: string, offendingNode: any) {
    this.emit('error', message, offendingNode, this.stopwatch.total);
  }

  loaded(path: string, duration: number): void {
    this.emit('loaded', this.fileSystem.relative(path), duration, this.stopwatch.total);
  }
  parsed(path: string, duration: number): void {
    this.emit('parsed', this.fileSystem.relative(path), duration, this.stopwatch.total);
  }
  attic(path: string, duration: number): void {
    this.emit('attic', this.fileSystem.relative(path), duration, this.stopwatch.total);
  }
  processed(path: string, duration: number): void {
    this.emit('processed', this.fileSystem.relative(path), duration, this.stopwatch.total);
  }

  constructor(public fileSystem: FileSystem) {
    super();
  }

}

export interface FileSystem {
  cwd: string;
  readFile(pathOrRelativePath: string): Promise<string>;
  resolve(pathOrRelativePath: string): string;
  relative(absolutePath: string): string;
}

/** supports file://, http:// and https://  */
export class UrlFileSystem implements FileSystem {
  cwd: string;
  get githubAuthToken() {
    return process.env['github-auth-token'] || process.env['githubauthtoken'] || undefined;
  }
  constructor(baseFolder: string = resolve()) {
    this.cwd = ResolveUri(cwd(), baseFolder);
  }
  resolve(pathOrRelativePath: string): string {
    return ResolveUri(this.cwd, pathOrRelativePath);
  }
  relative(absolutePath: string): string {
    return relative(this.cwd, absolutePath);
  }
  async readFile(pathOrRelativePath: string): Promise<string> {
    const uri = this.resolve(pathOrRelativePath);

    const headers: { [key: string]: string } = {};

    // check for GitHub OAuth token
    if (this.githubAuthToken && uri.startsWith('https://raw.githubusercontent.com')) {
      // console.log(`Used GitHub authentication token to request '${uri}'.`);
      headers.authorization = `Bearer ${this.githubAuthToken}`;
    }
    return ReadUri(uri, headers);
  }

}