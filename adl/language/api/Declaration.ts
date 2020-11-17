import { Element } from './Element';
import { SourceFile } from './SourceFile';
import { RawToken } from './Token';

export abstract class Declaration extends Element {

  #saved = false;
  #sourceFile?: SourceFile;

  get isSaved(): boolean {
    return this.#saved;
  }

  protected modified() {
    this.#saved = false;
  }

  get sourceFile(): SourceFile | undefined {
    return this.#sourceFile;
  }

  /** @internal */
  constructor(tokens = new Array<RawToken>()) {
    super(tokens);

  }

  xsave() {
    /**
     * This is when the actual modification of the parent/sourcefile is performed
     *
     * This allows the manipulation of constructs in memory to not invoke changes to
     * sourcefiles until the manipulation is complete.
     *
     * (unlike ts-morph, which instantly updated the sourceFile)
    */
    this.#saved = true;
  }

  /** Removes this declaration from a file. */
  remove() {
    //
  }
}
