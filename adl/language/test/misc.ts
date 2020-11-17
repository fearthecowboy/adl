import { strictEqual } from 'assert';
import { Label } from '../api/Label';
import { SourceFile } from '../api/SourceFile';
import { TokenCursor } from '../compiler/cursor';

function tokenCursor(text: string) {
  const sf = new SourceFile();
  sf.text = text;
  sf.name = 'inline.adl';
  return new TokenCursor(sf).start();
}

describe('Misc Tests', () => {
  it('Label Manipulations', () => {
    const cursor = tokenCursor('foo');
    const label = Label.parse(cursor);
    strictEqual(cursor.eof, true, 'should be consumed');

    // is it parsed correctly?
    strictEqual(label.length, 1, 'should be a single identifier token');

    // add a scope
    label.scope = 'hello';
    strictEqual(label.length, 3, 'should be three tokens (identifier, dot, identifier)');
    strictEqual(label.text, 'hello.foo');

    // remove the scope again
    label.scope = undefined;
    strictEqual(label.length, 1, 'should be a single identifier token again');
    strictEqual(label.text, 'foo');
  });
});