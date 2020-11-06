/** the Documentation type is the inteface to manipulating the documentation markup */

export class Documentation {
  // should contain at least accessors for:
  // - description, notes/remarks, parameters, pre/post conditions, returns, requires, seealso, throws
  // (see the full swift set https://developer.apple.com/library/archive/documentation/Xcode/Reference/xcode_markup_formatting_ref/MarkupFunctionality.html#//apple_ref/doc/uid/TP40016497-CH54-SW1 )
  get description(): string {
    throw new Error('Not Implemented');
  }

  set description(description: string) {
    //
  }
}
