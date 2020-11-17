import { TokenCursor } from '../compiler/cursor';
import { Kind, Scanner } from '../compiler/scanner';
import { Element } from './Element';
import { from } from './ElementCursor';
import { Preamble } from './Preamble';

/**
 * a Label can be either alone (ie `bar`) or scoped (ie `foo:bar`)
 @internal
 */
export class Label extends Element {
  readonly kind = Kind.Label;

  get name() {
    const c = from(this).find(Kind.Identifier);

    // check if it has a scope (ie, 'foo.bar')
    if (c.find(Kind.Dot).isInvalid) {
      return c.rawToken!.text;
    }
    return c.find(Kind.Identifier).rawToken!.text;
  }

  set name(name: string) {
    const c = from(this).find(Kind.Identifier);

    if (c.find(Kind.Dot).isInvalid) {
      c.rawToken!.text = name;
      return;
    }
    c.find(Kind.Identifier).rawToken!.text = name;
  }

  get scope(): string | undefined {
    const dot = from(this).find(Kind.Dot);
    // if there is no dot, there is not a scope. otherwise, it's the first identifier.
    return dot.isInvalid ? undefined : dot.find(Kind.Identifier).element!.text;
  }

  set scope(scope: string | undefined) {
    const dot = from(this).find(Kind.Dot);

    if (dot.isInvalid) {
      // doesn't have a scope

      if (scope) {
        // we have to insert it and the dot (and it's not empty)
        // dot.find(Kind.Identifier).insert({ kind: Kind.Identifier, offset: 0, text: scope }, { kind: Kind.Dot, offset: 0, text: '.' });
        dot.find(Kind.Identifier).insert(...Scanner.TokensFrom(`${scope}.`));
      }
      return;
    }

    // it already has a scope.

    if (scope) {
      // we're trying to set it
      from(this).find(Kind.Identifier).rawToken!.text = scope;
      return;
    }

    // we're trying to remove it.
    dot.remove();
    from(this).find(Kind.Identifier).remove();
  }

  static parse(cursor: TokenCursor, scoped = false) {
    const label = new Label();
    label.push(cursor.expecting(Kind.Identifier));

    if (scoped) {
      const preamble = Preamble.parse(cursor);
      if (cursor.is(Kind.Dot)) {
        label.push(preamble);
        label.push(cursor.take());
        label.push(Preamble.parse(cursor, true));
        label.push(cursor.expecting(Kind.Identifier));
        return label;
      }

      // the current token wasn't a colon, we have to give the preamble back.
      if (preamble.any) {
        cursor.peekAhead = preamble;
      }
    }
    return label;
  }
}
