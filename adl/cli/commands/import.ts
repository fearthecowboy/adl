import { importModel } from '@azure-tools/adl.core/dist/support/visitor';
import { CommandLine } from '../command-line';
import { createHost } from '../host';

export async function cmdImport(args: CommandLine) {
  console.log(`Import: ${args.inputs.join(',')} : 
    project: ${args.project}
  `);
  
  const host = createHost(args.inputFolder, '');
  const api =  await importModel(host, ...args.inputPaths);
  // const v = api.versionInfo[0].added;

  api.saveADL(`c:/tmp/compute/${args.switches.v[0]}/`, true);

}