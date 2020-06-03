import { Host, UrlFileSystem } from '@azure-tools/adl.core';
import { markdown } from './main';

export function createHost(sourceFolder: string, projectFolder: string) {
  const host =  new Host(new UrlFileSystem(sourceFolder));

  host.on('error', (text)=> {
    console.error(markdown(text));
  });

  host.on('warning', (text) => {
    console.log(markdown(text));
  });

  host.on('processed', (file, msec) => {
    console.log(markdown(`_Processed '${file}' in ${msec}_`));
  });

  return host;
}