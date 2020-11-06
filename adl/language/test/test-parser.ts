import * as assert from 'assert';
import { SourceFile } from '../api/SourceFile';
import { parse } from '../compiler/parse';
import { SyntaxKind } from '../compiler/types';

function parseContent(text: string, filename = 'inline.adl') {
  const sf = parse(text, filename);
  const newText = sf.save(false);
  assert.strictEqual(newText, text, 'parsed result does not match input text');
  return sf;
}

describe('Parse files', () => {
  describe('import statements', () => {
    it('import entire package', () => parseContent('from x import *;'));
    it('import one thing', () => parseContent('from x import { one };'));
    it('import import two things', () => parseContent('from x import { one, two };'));
  });

  describe('model statements', () => {
    it('empty model',
      () => parseContent('model Car { };')
    );

    it('decorated model', () => parseContent(
      `@foo()
       model Car { }; `));

    it('two-props model',
      () => parseContent(`model Car {
         prop1: number;
         prop2: string;
       }`
      ));

    it('two models ',
      () => parseContent(`model Car {
          engine: V6
        }
        
        model V6 {
          name: string
        }`));

    it('model with annotated props',

      () => (`model Car {
         @foo.bar('a', 'b')
         prop1: number;
         
         @foo.baz(10, "hello")
         prop2: string
       };`));
  });

  describe('model expressions', () => {
    it('model with literal type', () => parseContent(
      'model Car { engine: { type: "v8" } }'
    ));
  });

  describe('array expressions', () => {
    it('model with array property', () => parseContent(
      'model A { foo: Array<B> }'
    ));
  });

  describe('union expressions', () => {
    it('Union Types', () => parseContent(
      'model A { foo: B | C }'
    ));
  });


  describe('interface statements', () => {
    it('empty interface', () => parseContent(
      'interface Store {}'
    ));
    it('simple read function', () => parseContent(
      'interface Store { read(): int32 }',
    ));
    it('two methods', () => parseContent(
      'interface Store { read(): int32; write(v: int32): int32 }',
    ));
    it('decorated ', () => parseContent(
      '@foo interface Store { @dec read():number; @dec write(n: number): int32 }',
    ));
    it('another decorated', () => parseContent(
      '@foo @bar interface Store { @foo @bar read(): number; }',
    ));
  });

  describe('alias statements', () => {
    it('type alias', () => parseContent(
      'alias MyAlias : SomethingElse;'
    ));

    it('type alias with inlined model', () => parseContent('alias MyAlias : { constantProperty: 4 };',));
  });

  describe('multiple statements', () => {
    it('handles multiple statements', () => parseContent(`
      model A { };
      model B { }
      model C : A;
      ;
      interface I {
        foo(): number;
      }
      interface J {

      }


    `));
  });

  describe('comments', () => {
    it('', () => parseContent(`
      // Comment
      model A { /* Another comment */
        /*
          and
          another
        */
        property /* 👀 */ : /* 👍 */ int32; // one more
      }
      `));
  });
});

function test(name: string, text: string) {
  it(`parses ${name}`, () => {
    dumpAST(parseContent(text));
  });
}


function dumpAST(sourceFile: SourceFile) {
  const replacer = function (this: any, key: string, value: any) {
    return key == 'kind' ? SyntaxKind[value] : value;
  };
  console.log(JSON.stringify(sourceFile.statements, undefined, 2));
}

function shorten(code: string) {
  return code.replace(/\s+/g, ' ');
}
