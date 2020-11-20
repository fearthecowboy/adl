
Constructs
==========

## Patterns
``` swift  
// swift-stlye markup comments 
«ANNOTATIONS...» ## annotations that affect the declaration of the 'what'
what NAME {

}

// swift-stlye markup comments 
«ANNOTATIONS...» // annotations that affect the declaration of the 'what'
what NAME<T> { // templated declaration of the 'what'

}

// swift-stlye markup comments 
«ANNOTATIONS...» // annotations that affect the declaration of the 'what'
what NAME : PARENT... {

}

// swift-stlye markup comments 
«ANNOTATIONS...» // annotations that affect the declaration of the 'what'
what NAME : «ANNOTATIONS...» TYPE; // annotations that affect the TYPE;

```

### Things:
  - `model` - a complex object 
  - `enum` - a choice of a value
  - `alias` - a named alias of a declaration 
  - `interface` - an API interface (collection of operations)
  - `operation` - a single API operation (ie, call/response)
  - `resource` - An HTTP specific 'interface' that infers some identity

  - `response` - A set of possible outcomes from the operation
  - `result` - a single possible outcome of an operation 



### Annotations

  - constraint - the value must be limited by the constraint
  - encoding/serialization - the value must be encoded on the wire a particular way (`binary`,`xml`, `json`, `base64`, `` )
  - 

### Models

``` ts
model Pet { 
  // the pet's name
  name: string;

  // the size of the pet. 
  size: 'S' | 'M' | 'L';

  // what kind of pet is it
  kind: [discriminator] string;
}

model Cat : Pet { 
  // Cats must have the kind set to 'cat', and that is the polymorphic discriminator for the type.
  kind: [discriminator('cat')] string;
  
  // color of the cat.
  color: Color;
}
```

### API Interfaces 

``` ts 
[url('/api/store')] 
interface PetStore {
  // lists all the pets
  [get('./pet)]
  operation listPets(maximumReturned : [optional] int32) : {

  }
}
```


### Aliases  

Aliases are constructed using the `alias` keyword:
``` ts
  alias NAME: ANNOTATIONS TYPE;
```

Examples: 

An alias for a header:

``` ts 
  alias acceptDateTime: [header('Accept-Datetime')] [optional] string;
```

A type alias for a short string with a max length of 10 characters.

``` ts 
  alias shortString: [maxLength(10)] string;
```

You can reuse aliases in other aliases. (but not circularly!)
``` ts 
  alias otherString : [minLength(5)] shortString;
```



### Responses
