import * as fs from 'fs';
import * as path from 'path';

// automatically pull exports from all .js files in this project that 
// have a default export
function addExports(location: string = __dirname): any | undefined {
  const result: any = {};
  let count = 0;
  for (const name of fs.readdirSync(location)) {
    const fullPath = path.join(location, name);
    const stat = fs.statSync(fullPath);

    // directories should be recursed
    if (stat.isDirectory()) {
      const subdir = addExports(fullPath);
      if (subdir) {
        result[name] = subdir;
      }
      continue;
    }

    // .js files are checked for default exports
    // and added to the map 
    if (name.endsWith('.js')) {
      try {
        const mod = require(fullPath);
        if (mod.default) {
          // files with a default export are added to the tree.
          result[name.replace(/\.js$/g, '')];
        }
        count++;
      } catch {
        // ignore files that don't import cleanly. 
      }
    }
  }
  return count ? result : undefined;
}

const plugins = addExports();
export default plugins;

/*
export default <plugins>{
  sample,
  other
}
*/

/*

for( const each of fs.readdirSync() )

export interface plugins {
  [name: string]: plugin;
}

export interface parameterizedEvent<T> {
  [name: string]: fn;
}

export type fn = () => void;

export interface fooPlugin {
  onFoo?: parameterizedEvent<fn>;
}

export interface fooPlugin2 {
  onFoo?: fn;
}

export interface enumPlugin {
  onEnum?: fn;
}


export type plugin = enumPlugin | fooPlugin | fooPlugin2;
/*
export default <plugins>{
  sample,
  other
}



export interface Rule {}




export default <Tag> {
  onElementChanged: {
    'version-info' : () => {
      // check to see if the version info is correct
      if( ! /^\d\d\d\d-\d\d\-d\d.*$/g.exec(node.versionInfo.added) )  {
        return {error};
      }
    }
  }
  onTagChanged : {
    'x-ms-long-running-operation-options': (tag, model) => {
      const stuff = tag.content;
      if( stuff['final-state-via'] !== 'AzureLocation') {
        return {
          ...
        }
      }

    }
  }


}

export class LRODocTagExtension extends JsonContentDocTag {
  contentFormat: Formatters.AsJson;
  validate() {

  }
}
*/
