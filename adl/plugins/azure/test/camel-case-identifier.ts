import { ApiModel, UrlFileSystem } from '@azure-tools/adl.core';
import { Activation } from '@azure-tools/adl.core/dist/eventing/activation';
import { assert } from 'console';
import { describe } from 'mocha';

const scenarioName = 'camel-case-identifier';
describe(`Test ${scenarioName} rule.`, () => {
  const inputFolder = `${__dirname}/../../test/scenarios/${scenarioName}`;
  console.log(inputFolder);
  it('Returns diagnostic messages.', async () => {
    const api = new ApiModel(new UrlFileSystem(inputFolder));
    await api.load();
    const results = [...api.linter.run(Activation.edit)];
    const expectedMessages = [
      'The property \'Id\' must follow camel case style.',
      'The parameter \'Name\' must follow camel case style.',
      'The enumValue \'Small\' must follow camel case style.'
    ];

    for (const result of results) {
      assert(expectedMessages.includes(result.message));
    }
  });

  it('Applies quick fixes.', async () => {
    const api = new ApiModel(new UrlFileSystem(inputFolder));
    await api.load();
    const resultsBeforeFix = [...api.linter.run(Activation.edit)];
    assert(resultsBeforeFix.length === 3);

    for (const result of resultsBeforeFix) {
      if (result.suggestions && result.suggestions.length > 0) {
        result.suggestions[0].fix();
      }
    }

    const resultsAfterFix = [...api.linter.run(Activation.edit)];
    assert(resultsAfterFix.length === 0);
  });
});

