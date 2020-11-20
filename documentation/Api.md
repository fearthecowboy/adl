# Api/Object model

The APIs here provide programatic access to the ADL project and files, and are 
intended to completely isolate the ADL consumer (ie, tools/editors/etc) and extensions 
from requiring any knowledge of the internal formats (ie, tokens) of anything inside ADL at all.

The APIs here are a general outline of the functionality required; obviously there will
be additional members, but this should suffice as the starting off point for understanding
how the API is exposed.

# ADL Core 

The ADL Core project is the exposed API surface for using/manipulating ADL projects

Fundementals in the Core are abstracted so that implementations can be provided for different contexts.
This includes things like a `Filesystem` and `Message`s, which is critical to enable cases where all file access must be backed
by a specific implementation (ie, a vscode extension shouldn't reference the filesystem directly, it should be 
using the VSCode APIs to access all files.)



## API `Project` classes

<hr>

### class `ApiModel`
The encapsulating class that manages a whole project, as well as handling management of extensions (protocols, linter, etc) and has a mechanism for dealing with data that is not covered by ADL files (aka 'the attic')

- `load()` - Initializes a project and loads files in an API model  
- `save()` - Saves modifies ADL files back to the filesystem

Project level management: 
- `files: Iterable<SourceFile>` - the flat collection of files in the given project
- `directories: Iterable<Directory>` - the collection of directories in the project. 
- `addDirectory(relativePath)`  - adds a new directory to the the directories in the project.

Members for specific handling of extensions
- `protocols: Dictionary<Protocol>` - returns the registered protocol extensions

There are a number of properties which provide programatic access to the constructs in the API Model  

- `models: Iterable<Model>` - gets the models in the project  
- `enums: Iterable<Enum>` - gets the enums in the project  
- `interfaces: Iterable<Interface>` - gets the interfaces in the project  
- `typeAliases: Iterable<TypeAlias>` - gets the type aliases in the project  
- `parameterAliases: Iterable<ParameterAlias>` - gets the parameter aliases in the project 

<hr>

### class `Directory` 
A container that represents a collection of files in a single folder on disk

- `files: Iterable<SourceFile>` - the flat collection of files in the given project
- `addSourceFile(name) : SourceFile ` - creates a new adl source file in the given directory

<br>
<br>


# ADL Language 
The ADL Langauge project provides the internals for accessing/manipulating ADL source files. 

This includes providing support for parsing files into a mutable object model that can be used to query and manipulate the document live.

<hr>

### class `SourceFile`

- `readonly imports: Iterable<Import>` - returns the `import` statements from the given file  
- `addImport(referencedProject): Import` - adds an import statement to the source file. 

- `readonly models: Iterable<Model>` - gets the models in the sourceFile  
- `addModel(name): Model` - adds a new model to the source file 

- `readonly enums: Iterable<Enum>` - gets the enums in the sourceFile  
- `addEnum(name): Enum` - adds a new enum to the source file.

- `readonly interfaces: Iterable<Interface>` - gets the interfaces in the sourceFile  
- `addInterface(name): Interface` - adds a new Interface to the source file.

- `readonly typeAliases: Iterable<TypeAlias>` - gets the type aliases in the sourceFile  
- `addTypeAlias(name): TypeAlias` - adds a new TypeAlias to the source file.

- `readonly parameterAliases: Iterable<ParameterAlias>` - gets the parameter aliases in the sourceFile 
- `addParameterAlias(name): ParameterAlias` - adds a new ParameterAlias to the source file.

- `readonly responseAliases: Iterable<ResponseAlias>` - gets the response aliases in the sourceFile 
- `addResponseAlias(name): ResponseAlias` - adds a new ResponseAlias to the source file.


<hr>

### Class `BaseElement` 
All elements are responsible to be able:
  - `readonly kind: Kind` - identify the Kind of token they represent.
  - `readonly AST: Array<Token>` -  to emit themselves as a stream of token
  - `readonly text: string` - emit the raw source text for itself
  - `remove()` - remove themselves from their parent. 

The base element doesn't assume the element can support documentation (although, comments are preserved.)

<hr >

### Class `Element` extends `BaseElement`
Elements support documentation on top of the base element:
  - `readonly documentation: Documentation` - manipulation access to documentation 

<hr>

### class `Import` extends `Element`
Mutable properties:
  - `from: string` - the project that the import is coming from
  - `readonly elements: Iterable<string>` the collection of elements being imported
  - `addElement(string)` - adds an named element to import to the import statement.
  
<hr>

### class `AnnotatableElement` extends `Element`
Elements that support annotations implement
  - `readonly annotations: Iterable<AnnotationExpression>` - manipluation access to annotations (aka 'decorators') 
  - `addAnnotation(name,parameterValues, templateParameters): AnnotationExpression` - adds an annotation 


### class `NamedDeclaration` extends `AnnotatableElement`
Common properties for named declarations include support for:
  - `name: string` - the name of the declaration

<hr>

### class `Model` extends `NamedDeclaration`
Represents a model declaration in a source file 
  - `readonly properties: Iterable<Property>` - access to the properties in the model
  - `addProperty(name, typeExpression)` - adds a new property to the model
  - `parents: Iterable<Model>`- models that this model extends from
  - `addParent(model)` - add a parent model to this model 


<hr>

### class `Enum` extends `NamedDeclaration`
Represents an enum declaration in a source file.
  - `readonly values: Iterable<EnumValue>` - access to the EnumValues in the Enum
  - `addValue(name, literalValue): EnumValue` - adds a new EnumValue to the enum

<hr>

### class `Interface` extends `NamedDeclaration`
Represents an Interface declaration (operation group) in a source file
  - `readonly operations: Iterable<Operation>`  - access to the Operations in the Interface
  - `addOperation(name): Operation` - adds an Operation to this interface
  
  - `readonly interfaces: Iterable<Interface>` - access to the nested interfaces in this Interface
  - `addInterface(name): Interface` - adds an new nested interface to this Interface

<hr>

### class `TypeAlias` extends `NamedDeclaration`
A decalartion of a named alias to a typeExpression
TypaAliases can have template parameters.
  - `type: typeExpression` - the type expression for the alias.
  - `templateParameters: Iterable<TemplateParameter>` - the list of template parameters this alias has as inputs
  - `addTemplateParameter(name)` - adds a template parameter to the type alias. 


<hr>

### class `ParameterAlias` extends `NamedDeclaration`
A declaration of a named alias for a parameter. 
  - `type: typeExpression`

Physically, there isn't much distinction between a TypeAlias and a ParameterAlias.
- A ParameterAlias can be used instead of a parameter, getting it's name from the ParameterAlias itself. 
- ParameterAliases can have parameter-specific annotations (ie, [body],[query],etc.)
- ParameterAliases can **not** have template parameters


<hr>

### class `ResponseAlias` extends `NamedDeclaration`
A ResponseAlias is a collection of one or more responses 
  - `templateParameters: Iterable<TemplateParameter>` - the list of template parameters this response alias has as inputs
  - `addTemplateParameter(name)` - adds a template parameter to the response alias. 

<hr>

### class `Response` extends `NamedDeclaration`
A single response delcaration (ie, one set of criteria, inputs and outputs)
  - 
  - `templateParameters: Iterable<TemplateParameter>` - the list of template parameters this response has as inputs
  - `addTemplateParameter(name)` - adds a template parameter to the response. 
  - `parameters: Iterable<Parameter>` - access to the parameters from the response.
  - `addParameter(name, typeExpression)`
  - `isException: boolean` - manipulate the result to throw or not.
  - `result: ResultExpression` - the result expression (what the user is looking for.)

<hr>

### class `ResultExpression` extends `Element`
An expression that identifies what out of the response inputs is to be given to the consumer.
   - __TBA__

<hr>

### class `Property` extends `NamedDeclaration`
A property represents a property in a model.
  - `type: typeExpression` - the type of the property.
  
<hr>

### class `EnumValue` extends `NamedDeclaration`
An `EnumValue` represents a single name/value pair in an enum
  - `value: LiteralValue` - the value that the `enumValue` represents.

<hr>

### class `Operation` extends `NamedDeclaration`
  - `parameters: Iterable<Parameter>` - access to the parameters from the response.
  - `addParameter(name, typeExpression)` - adds a parameter to the operation
  - `response: ResponeseExpression` - allows manipulation of the Response for the operation

<hr>

### class `ResponseExpression` extends `Element`  
The ResponseExpression deals with the declared response for a given operation
  - **TBA**

<hr>

### class `TypeExpression` extends `Element`
A `TypeExpression` is the __use__ of a type, not it's declaration. 
These are the more complicated cases, as they have to deal with Template Resolution, references etc. 
  - **TBA**

<hr>

### class `Documentation` extends 
A programatic interface to the documentation for a given element.
The interface for the Documentation class offers the full ability for crafting documentation 
regardless of whether the documentation is relavent to the target element.
(see https://developer.apple.com/library/archive/documentation/Xcode/Reference/xcode_markup_formatting_ref/index.html)

- `description: string` - the descriptive markup text 
- `callouts: Iterable<Doc.Callout>` - the collection of callouts in the text
- `addCallout(name:string): Doc.Callout`  - adds a callout to the documentation

The `Callouts` is a general, lower-level way of manipulating callouts. Likely we'll make 
specific sub-classes for well-known callouts. The canonical list is:  
- Attention - 
- Author
- Authors
- Bug
- Complexity
- Copyright
- Custom Callout
- Date
- Example
- Experiment
- Important
- Invariant
- Note
- Precondition
- Postcondition
- Remark
- Requires
- See Also
- Since
- Version
- Warning

<hr>

### class `AnnotationExpression`
AnnotationExpressions layer on information by adding arbitrary extensions to the language
  - `name: string` - the name of the declaration
  - `templateParameterValues: Iterable<TemplateParameterValue>` - the list of template parameter values this annotation has
  - `addTemplateParameterValue(name)` - adds a template parameter value to the annotation. 
  - `parameters: Iterable<ParameterValue>` - access to the parameters for the annotation
  - `addParameter(paraemterValue)` - adds a parameter value to the annotation expression.
  
