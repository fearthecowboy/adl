import * as assert from 'assert';
import { parse } from '../compiler/parse';

function parseContent(text: string, filename = 'inline.adl') {
  const sf = parse(text, filename);
  const newText = sf.save(false);
  assert.strictEqual(newText, text, 'parsed result does not match input text');
  return sf;
}

describe('Mutate a model', () => {
  it('can change name', () => {
    const file = parseContent(`
    model Car { 
      year: number; 
    }
    `);

    // find all models that have the name 'Car'
    const models = file.models.where(each => each.name === 'Car');
    assert.strictEqual(models.length, 1, 'should be one model ');

    // we have the car.
    const car = models[0];

    // make sure that the name is as expected
    assert.strictEqual(car.name, 'Car');

    // change the name
    car.name = 'BigCar';
    assert.strictEqual(car.name, 'BigCar');

    // save modified elements back to the file.
    file.save();

    // check that the whole file output matches what we expect.
    assert.strictEqual(file.text, `
    model BigCar { 
      year: number; 
    }
    `);
  });

  it('playing around', () => {
    const file = parseContent(`
    model Car { 
      year: number; 
    }
    `);

    const car = file.models[0];
    car.s = 'yobot';

    // save modified elements back to the file.
    file.save();
    console.log(file.text);
  });

});