import { ApiModel, UrlFileSystem } from '@azure-tools/adl.core';
import { Activation } from '@azure-tools/adl.core/dist/eventing/activation';
import { assert } from 'console';
import { describe } from 'mocha';

const scenarioName = 'avoid-inline-types';
describe(`Test ${scenarioName} rule.`, () => {
  const inputFolder = `${__dirname}/../../test/scenarios/${scenarioName}`;
  console.log(inputFolder);
  it('Returns diagnostic messages.', async () => {
    const api = new ApiModel(new UrlFileSystem(inputFolder));
    await api.load();
    const results = [...api.linter.run(Activation.edit)];
    const expectedMessages = [
      'The type of the property \'location\' is inlined.'
    ];

    for (const result of results) {
      assert(expectedMessages.includes(result.message));
    }
  });
});

