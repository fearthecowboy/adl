import { Origin, valueOf } from './proxies';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface anonymous extends Anonymous { }

class Anonymous {
  protected anonymous: string;
  constructor( identity: string|anonymous) {
    
    this.anonymous = identity instanceof Anonymous ? identity.anonymous :  valueOf(identity) ||  'unknown';
  }
 
  get name() {
    return `anonymous<${this.anonymous}>`;
  }
}
export const anonymous = (instance: any) => new Anonymous(instance);

export type Step = string | number | symbol | anonymous;
export type Path = Array<Step>;

export * from './proxies';

export function isAnonymous(instance: any): instance is anonymous {
  return instance instanceof Anonymous;
}

export class Tracker {

  add(inTarget: Path, inSource: Origin) {
    // 
  }
}