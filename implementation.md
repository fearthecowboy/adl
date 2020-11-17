# Thoughts
  - It may be beneficial to merge the Language and Core projects, I think the distinction between them is getting really thin.
  - The OpenAPI/Http support for the TS/ADL is built into the Core project, it should be spun out into a separate library (it's *fairly* isolated in anticipation of that)

##  Language Project - Things that must be completed

  - adjust parsing for language elements to reflect the actual current state of the language.  
    It currently is a simplified expression and some experimentation of the language.

  - Mutation APIs for all the elements (Model/Property has a very small example)

  - Error/Warning/Message propogation (currently it's all adhoc to the console)

  - SourceFile/Directory/Project needs implementation. It's all adhoc manual stuff right now.


## Core Project - Things that must be completed
  - The core project is entirely TypeScript/TSMorph based, and the internals need to be completely retrofitted 
    to use the Language project to parse and mutate the Elements.
  
  - The core project has a lot of code for constructing elements (to abstract away from TS) - alot of that just goes away with the ADL Language (which should do the job)

  - The linter is wired up, but other pluggable things (ie, protocols, libraries, etc) are not. (a lot of this will depend on how you want it to work)
  
  
## Linter
  - The Linter project may require some modification if the previous task requires changes to the public interface to the Core

## CLI 
  - The CLI tool may require changes to support any changes in the Core library
  - The CLI only has a couple of simple things implemented at the moment (import project), once the Core is working, more functionality can be added

  - I don't have any examples for the CLI as the CLI only does a couple things, and the model isn't used from the CLI directly.

## Example usage of the model from linting rules

Really, once the core is updated to use the ADL language instead of TS, this should not be significantly different.

### examples 

The files in `adl/plugins/azure/rules/` are the existing examples of linting rules.
Most of them shouldn't require much in the way of changing (see examples below).

The ones that deal with documentation/descriptions are probably going to require tweaking to support, the docs interfaces will probably be quite a bit different. (depending on how they are implemented)

####  see adl/plugins/azure/rules/avoid-inline-types.ts

Most of this should stay the same, a small change would be expected 
  - the `createModelType` call isn't going to be identical -- the current TS/ADL is constructing the new type from the text of the inline type. (although, something like that could be done I suppose.)

``` ts 
  
  onProperty: (model, property, data) => {
    const type = property.type;
    if (isInline(type)) {
      return {
        message: `The type of the property '${property.name}' is inlined.`,
        suggestions: [
          {

            description: 'Extract contents and create a model definition for this type.',
            fix: async () => {
              const typeReference = model.createModelType(property.name, { text: type.declaration.text });
              property.type = typeReference;
              await model.fileSystem.writeFile((<ExtendedSourceFile>typeReference.node.getSourceFile()).relativePath, typeReference.node.getSourceFile().getFullText());
            }
          }
        ]
      };
    }
```


#### se adl/plugins/azure/camel-case-identifier.ts 

I would expect the only things that need to change here is that the `.name` properties will just be string and wouldn't need to be `.toString()`'d 

``` ts
function checkCamelCaseIdentifier(type: string, element: NamedElement<any>): RuleResult | undefined {
  const camelCaseRegex = /^[a-z]+(?:[A-Z][a-z]+)*$/g;
  if (!element.name.toString().match(camelCaseRegex)) {
    return {
      message: `The ${type} '${element.name.toString()}' must follow camel case style.`,
      suggestions: [
        {
          description: 'Rename to follow camel case style.',
          fix: () => {
            element.name = camelCase(element.name.toString());
          }
        }
      ]
    };
  }
```

