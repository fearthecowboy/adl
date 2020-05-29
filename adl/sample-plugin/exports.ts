import * as fs from 'fs';

// exports 
const items: any = {}
for (const each of fs.readdirSync()) {
  // .js files
  items[name] = require(`./${each}`);
}
export default items;
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
