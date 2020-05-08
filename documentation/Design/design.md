# ADL/API Design

## Definitions: 
- ADL - __Api Description Language__ -  a selection of TypeScript that can encode an API that is exposed via a wide range of protocols.
- AM  - __AbstractModel__ - an internal representation of ADL that has the fidelity to express everything in ADL (not intended for consumption initally, may be for tooling later.)
- OAI or OpenAPI -- When we say OpenAPI we mean OpenAPI 3.0+ 
- Swagger -- When we say Swagger we mean OpenAPI 2.0 (aka swagger)

<hr>

## Target Scenarios:
 - Reviewing - Easy to review changes to APIs.  Diffs are readable by engineers unfamiliar with the API review process.
 - Tooling - Supports multi-versioning well without the need for confusing or extensive tooling.
 - Authoring - Easier for those creating the API definitions.
 
<hr>

## Primary Goals:

#### - Name 
- are we good with `ADL` (which was my play on `IDL`) -- I don't have a better one, but now is the time to make any changes. <br>
options: APIDL, AiDL, TSADL, AltDL, 1dl (ie, IDL, but 1 :) ,  , etc? 

#### - Lang uage Specification

- Finalize exactly how everything is described in ADL
- Things to resolve:
  - Modeling a resource -- should they be declared as inheriting a pre-defined operations `class` that ties to the model? (currently, they are just arbitrary interfaces that have some metadata.) -- OAI/Swagger claims to model resources, but it's only inferred around Schemas/Operations. 
  - layering on protocol information -  I switched away from using decorators, and just put the protocol information in as doctags  (`@http PUT /../../...` type of thing ) -- but it's still slightly orthoganal to specifying parameters and responses (ie `name: Query<string>, contentType: Header<string>` )... is there any other way to model that? Doctags still enable us to programatically work with the values, and don't cross any weird lines with the language. 
  - all unexpected OAI extensions (ie,`x-foo-bar` ) just add an @extension doc tag, and inline the value in the doctag?
  - Identify how third-party typings extensions work (ie, ARM specific things) and how others can add strong typing and support for custom extensions (and linting/restrictions,etc)
  - review how `tsconfig.json` and `package.json` are used to configure an ADL project.
  - support Models/Resources/Operations spanning multiple API versions. (without having to perform disambiguation/deduplication/reduction )
  - ensure that there is sufficient grammar to support describing deprecation, removal, renaming between API versions 

#### - Loading/Saving an API model:
From the following formats

- ADL (TypeScript as an API Description Language) 
- Swagger (OpenAPI 2.0)
- OpenAPI 3.0+ 

The loading and saving should preserve all source location as a persisted [SourceMap](#SourceMaps).

The fidelity of the AM should permit 100% of the data in the input to be preserved. (including comments)


#### - Abstract model (AM)
- The AM should be able to be persisted to a serialized state (YAML)
- a (JSON?) Schema that can describe the AM to provide read access to the model for consumer software that can't leverage the library. (ie, a static serialized copy of the AM.)
- Should be a completely declaritive model

#### - Programatic access to the AM 

- An API for creating/traversing/manipulating the AM, the foundation of tools working with the model.

#### - Support typing for Authoring Experience
- A 'typings' package that can be installed via an NPM that fulfills the basic type system for ADL documents (enabling full editor support)

#### - Library support
- Produce a NPM package for programmatic use from TypeScript (in-proc, out-of-proc) and other languages (out-of-proc) via a standardized JSON-RPC interface

#### - Resources, Operations, Schemas
- Should be possible to identify a Resource (that standardized CRUD operational templates can be applied to)
- Operations are supported in and out of an operation group
- Schemas used for Models and Enum types are fully supported

### - Protocols 
- Protocol details are layered on top of Resources and Operations with doctag attributes
- Initially, support for REST/HTTP protocol details 
- Investigate/prototype (before 1.0) what would other protocols look like (ie, AsyncAPI for MQTT/AMQP/etc)


<hr>

## Extensibility

- Use of the API to programmatically access/manipulate an SM 
- Support the declaration and reuse of libraries with additional/custom constraints  (ie, ARM-specific features)
- API can be used by the cairo runtime along with supplemental source files to support live conversion between api versions. (conversion should not be included in the API declaration itself.)

<hr>

## NON-Goals (discussion)
At this point in time, the following are not intended as direct goals: 

- byte-exact round-tripping of OAI/Swagger files when loading/saving -- JSON/YAML are persisted object graphs and interpretation of how things are stored may not provide byte-perfect 
  representations of the model. 

- Merging/composition of the AM is not part of the API<br>
  AutoRest provides functionality to merge API versions, deduplication, subset-reduction, etc. 
  The API will not provide that behavior. (as it requires 'interpretation' of the model itself. )

- The AM design should not place artificial constraints upon what can be expressed. If it's 'legal' Swagger/OpenAPI it should be able to be loaded. (a 'linting' service can be crafted tangentially to the API/AM)

- Code in the model delcaration is not supported -- additional support for normalization/conversion (aka 'cairo')  can be stored in separate files alongside the model itself.

<hr>

## Deliverables: 
- __Documentation__: Complete `ADL` Authoring specification -- describes the scope of authoring an API in ADL, (types, operations, resources, schemas, constraints, etc)
- __Module__: `ADL.core` - handles the serialization/deserialization of SMs and exposes a programatic API for manipulating them (including sourcemaps) -- with a easily generated wrapper this can be consumed from other languages too (ie, producing a c# binding and nuget package should be easy)
- __Module__: `ADL.types` - provides typescript type information for editing ADL files (exposes all the known types, constraints, etc)
- __Module__: `ADL.ARM.types` -- provides support for ARM specific concepts ( this suits as an example how to add concepts to ADL) -- is this pluggable code? 
- __Module__: `SourceMapResolver` - provides out-of-proc support for managing/compiling serialized source maps  -- usage of this should be not 
- __CLI__ : `ADL` - an ADL tool for doing simple things like creating a new project, quick syntax check, etc. (ie, `ADL init`, `ADL check`, `ADL transform` )  -- is this the heart of a language service/linter?  

## Next
- AutoRest 3.5 -- add support to load in ADL models into the AutoRest pipeline and use generators directly (ideally, this replaces current Swagger/OpenAPI loaders too)
- Linting - Given that we're moving quickly now, we can use returning Intern Nelson to produce extensible linting and authoring support for ADL in VSCode
- Validation Engine - As a complete replacement for JSON Schema that can perform validation and code completion on models (ie for Azure Resource Templates)

> #### Things to consider:
> ADL is currently designed to require very little to 'work' -- ie, a `tsconfig` with a reference to the base types and VSCode just works. 
  The question is should we handle configuration more (ie, make a custom `adl.config` file and manage everything in tooling (ie, `adl add ARM.types`)) -- but this would require a VSCode plugin, and drastically reduce the ability to work in unsupported environments (ie, anything that doesn't support the language service protocol. )
>
>  Obviously, right now, a bit of extra config makes it so we don't have to implement a bunch of stuff to work, so it's probably OK to put that on the back burner until we have a full working prototype.


## References

#### SourceMaps
Source Map support for any given file

  see https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit  

  node library: https://github.com/mozilla/source-map

#### YAML/JSON
  Yaml 1.2 is the standard for loading JSON and YAML graphs.
   
  YAML library https://github.com/eemeli/yaml supports getting source locations for the nodes
  (can we translate to sourcemaps?)

