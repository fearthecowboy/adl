import * as assert from 'assert';
import { TypeExpression } from '../api/typeExpression';
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

  it('add/remove/change properties around', () => {
    const file = parseContent(`
    model Car { 
      year: number; 
    }
    `);

    const car = file.models[0];

    assert.strictEqual(car.Properties.length, 1, 'Should have one property');

    car.createProperty('brand', new TypeExpression('string'));
    assert.strictEqual(car.Properties.length, 2, 'Should have two property');

    const brand = car.Properties.find(each => each.name === 'brand');
    assert.strictEqual(!!brand, true, 'must have \'brand\' property');

    // change the name of the property
    brand!.name = 'make';

    const make = car.Properties.find(each => each.name === 'make');
    assert.strictEqual(!!make, true, 'must have \'make\' property');

    car.Properties[0].remove();
    // save modified elements back to the file.
    file.save();

    console.log(file.text);
  });

});