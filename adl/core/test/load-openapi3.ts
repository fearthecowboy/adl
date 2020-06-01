import { isFile, writeFile } from '@azure-tools/async-io';
import { linq } from '@azure-tools/linq';
import { v3 } from '@azure-tools/openapi';
import { equal, fail } from 'assert';
import * as chalk from 'chalk';
import { readdirSync, statSync } from 'fs';
import { describe, it } from 'mocha';
import { basename, resolve } from 'path';
import { ApiModel } from '../model/api-model';
import { deserializeOpenAPI3 } from '../serialization/openapi/v3/serializer';
import { Stopwatch } from '../support/stopwatch';
import { clean, createHost, formatDuration } from './common';
import { Errors as AccumulateErrors, Errors } from './errors';
import { serialize } from './serialization';

require('source-map-support').install();

const scenarios = `${__dirname}/../../../test/scenarios/v3`;

async function checkAttic(api: ApiModel, errors: Errors, atticOutput: string) {
  if (api.attic) {
    const attic = <v3.Model>api.attic;

    /*
    // verify that the attic does not have things we expect to be done
    errors.check(() => equal(attic.info, undefined, 'Should not have an info section left in attic'));
    errors.check(() => equal(attic.openapi, undefined, 'Should not have an openapi section left in attic'));
    errors.check(() => equal(attic.tags, undefined, 'Should not have a tags section left in attic'));
    errors.check(() => equal(attic.externalDocs, undefined, 'Should not have an externalDocs section left in attic'));

    errors.check(() => equal(attic.components?.schemas, undefined, 'Should not have components/schemas section left in attic'));
    errors.check(() => equal(attic.components?.parameters, undefined, 'Should not have components/parameters section left in attic'));

    errors.check(() => equal(attic.components?.requestBodies, undefined, 'Should not have components/requestBodies section left in attic'));
    errors.check(() => equal(attic.components?.headers, undefined, 'Should not have components/headers section left in attic'));
    errors.check(() => equal(attic.components?.responses, undefined, 'Should not have components/responses section left in attic'));
    errors.check(() => equal(attic.components?.securitySchemes, undefined, 'Should not have any components/securitySchemes left in attic'));

    errors.check(() => equal(attic.components, undefined, 'Should not have components section left in attic'));
*/
    await writeFile(atticOutput, serialize(api.attic));
    delete api.attic;
  }
}

describe('Load Single OAI3 files', () => {
  const inputRoot = `${scenarios}/single/input`;
  const outputRoot = `${scenarios}/single/output`;
  const files = linq.values(readdirSync(inputRoot)).where(each => statSync(`${inputRoot}/${each}`).isFile()).toArray();

  for (const file of files) {
    if( file.startsWith('_')) {
      continue;
    }
    it(`Processes '${file}'`, async () => {
      console.log('\n');
      const host = createHost(inputRoot);
      const api = await deserializeOpenAPI3(host, file);
      const name = basename(file, '.yaml');

      const adlOutput = resolve(`${outputRoot}/${name}`);
      
      // clean the folder and write out ts files
      const stopwatch = new Stopwatch();
      const n = await api.saveADL(adlOutput, true);
      console.log(chalk.cyan(`      save ADL: '${file}' - ${n} files saved - ${formatDuration(stopwatch.time)} `));

      const apiOutput = resolve(`${adlOutput}/${file.replace(/.yaml$/ig, '.api.yaml')}`);
      const atticOutput = resolve(`${adlOutput}/${file.replace(/.yaml$/ig, '.attic.yaml')}`);

      const errors = new AccumulateErrors();

      await clean(apiOutput, atticOutput);
      await checkAttic(api, errors, atticOutput);

      
      // reset timer
      stopwatch.time;

      const content = serialize(api);
      console.log(chalk.cyan(`      serialize: '${file}' ${formatDuration(stopwatch.time)} `));
      // write out yaml 
      await writeFile(apiOutput, content);
      console.log(chalk.cyan(`      save: '${file}' ${formatDuration(stopwatch.time)} `));
      equal(await isFile(apiOutput), true, `Should write file ${apiOutput} `);

      if (errors.count > 0) {
        fail(`Should not report errors: \n      ${errors.summary}\n`);
      }
    });
  }
});

describe('Load Multiple OAI3 files', () => {
  const root = `${scenarios}/multiple`;
  const folders = linq.values(readdirSync(root)).where(each => statSync(`${root}/${each}`).isDirectory()).toArray();

  for (const folder of folders) {
    const inputRoot = resolve(root, folder, 'input');
    const adlOutput = resolve(`${inputRoot}/../output/`);

    it(`Processes '${folder}'`, async () => {
      console.log('\n');
      const host = createHost(inputRoot);

      const files = linq.values(readdirSync(inputRoot)).where(each => statSync(`${inputRoot}/${each}`).isFile()).toArray();
      const api = await deserializeOpenAPI3(host, ...files);

      
      // clean the folder and write out ts files
      await api.saveADL(adlOutput, true);
      const apiOutput = resolve(`${adlOutput}/${folder}.api.yaml`);
      const atticOutput = resolve(`${adlOutput}/${folder}.attic.yaml`);
      const errors = new AccumulateErrors();

      await clean(apiOutput, atticOutput);
      await checkAttic(api, errors, atticOutput);

      const stopwatch = new Stopwatch();
      const content = serialize(api);
      console.log(chalk.cyan(`      serialize: '${folder}' ${formatDuration(stopwatch.time)} `));
      await writeFile(apiOutput, content);
        
      console.log(chalk.cyan(`      save: '${folder}' ${formatDuration(stopwatch.time)} `));
      equal(await isFile(apiOutput), true, `Should write file ${apiOutput} `);
      
      if (errors.count > 0) {
        fail(`Should not report errors: \n      ${errors.summary}\n`);
      }
    });
  }
});