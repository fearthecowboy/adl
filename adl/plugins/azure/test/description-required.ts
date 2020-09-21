import { ApiModel, UrlFileSystem } from '@azure-tools/adl.core';
import { Activation } from '@azure-tools/adl.core/dist/eventing/activation';
import { assert } from 'console';
import { describe } from 'mocha';

const scenarioName = 'description-required';
describe(`Test ${scenarioName} rule.`, () => {
  const inputFolder = `${__dirname}/../../test/scenarios/${scenarioName}`;
  console.log(inputFolder);
  it('Returns diagnostic messages.', async () => {
    const api = new ApiModel(new UrlFileSystem(inputFolder));
    await api.load();
    const results = [...api.linter.run(Activation.edit)];
    const expectedMessages = [
      'The modelType \'Pet\' lacks a description. Please consider adding one.',
      'The property \'id\' lacks a description. Please consider adding one.',
      'The operation \'CheckAvailability\' lacks a description. Please consider adding one.',
      'The operationGroup \'BookStoreOperations\' lacks a description. Please consider adding one.'
    ];

    for (const result of results) {
      assert(expectedMessages.includes(result.message));
    }
  });
});

