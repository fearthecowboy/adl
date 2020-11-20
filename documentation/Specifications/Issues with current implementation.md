Opportunities for Improvement
====

## Issues with current implementation

### A 'compile-to-graph' model is inherently flawed.
  - graph doesn't support the ability to go back to source code
  - we're losing positional information (source locations)
  - authoring support will require us to apply (logical and/or literal) edits to the source files.
    (ie, 'add a property to model XYZ' -- the intermediate model is useless)
  - an API over the source file (like we had with ts-morph/typescript) would allow us to always keep the 'source-of-truth' in the sourcefiles.
  - the graph is completely useless for working on any kind of editing support. (refactoring, linting, highlighting, navigation). The AST is useless for this as well, since the AST doesn't represent the context of what everything is. (ie, you can't ask for a model by name from the AST, you'd have to run a visitor)
  - 

### Decorators as 'transformations to graph' just make it harder to consume
  - further exacerbate the source-map problem
  - ADL consuming apps don't get fidelity as to how the files are constructed. Any data lost in transformation is gone.
  - Decorator data isn't present in the intermediate model 

### Intermediate Model is just a bucket of "Types"
  - this requires consumer of the model to visit everything to find anything

### Adhoc loading of Javascript as an extension mechanism is wreckless and ensures too much open ended access to ADL Language internals
  - This is a recipe for disaster

### The code is continually getting jammed into a single module
  - The project was built in many modules.
  - Functionality should have been added in the right modules


<hr>

## Process Problems

### Racing towards short term proof of end-to-end isn't ensuring we're doing a good job.
  - Racing to provide a 'proof' via end-to-end ensures that we're building a flaky product
  - the adhoc transformation to swagger doesn't make sure that we're accounting for everything. 
  - lack of unit testing along the way will make it orders of magnitude more difficult to fix anything 
  - We screw this up even a little bit, nobody will use it. 

### Documentation
  - We need more than just 'examples'
  - Documents that at least describe the specification in minimal detail allow others to understand better
  - Documentation prevents problems with "Hit-by-a-bus", Reorganizations, Career Mobility, etc. https://olvr.votewa.gov/src/index.js

### This isn't nor EVER SHOULD EVER BE a replacement for autorest. 
  - We have decades of person-hours in AutoRest that represent an incredible amount of knowledge of code generation
  - Replacing that is unnecessary and time wasting. 
  


<hr>

## Issues in language design

### A camel is a horse designed by a committee
  - we're producing a language where the complexity is going to be to the point 
    that adoption will be non-existant

### Everything isn't just a model. 
  - We have many fundemental concepts which we've throw away because "Well everything is just a model" .. 
  - Things that are not models: 
    - Type Aliases
    - Parameter Aliases
    - Responses
    - Requests
    - Operations
    - Interfaces
    - Resources
  - By engineering something that is overly generic and using decorators to mean everything means that the language has no constructs of value.

### Confusing the author
  - The usage of '...'  all over to expand out everything makes things increasingly complex to understand


### Sacrificing expressiveness for minimalism increases 

### 




