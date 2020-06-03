import { Element } from './element';

export class Alias<T> extends Element {
  // 
  constructor(public aliasType: string, public name: string, public target: T, initializer?: Partial<Alias<T>>) {
    super();
    this.initialize(initializer);
  }
}