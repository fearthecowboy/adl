
# grpc/http petstore


# Http version
``` ts

// HTTP Petstore
interface PetStore {

  // List all pets
  // - param limit: How many items to return at one time (max 100)
  @get('/pets') 
  listPets(@query @maximum(100) @minimum(0) @optional limit:int32 ) : { 
    // returns the pets in the store, up to the limit specified
    @statusCode(200)
    @contentType('application/json')
    returns (@body pets: Array<Pet>, @header('x-next') nextLink: url ) => pets;

    // any other response is an error and should have a body that describes the error
    @default
    @contentType('application/json')
    returns (@body error: Error ) => throw error;
  };

  @post('/pets') 
  createPet(@body pet: Pet) : {
    // returns the created Pet (which will contain the id)
    @statusCode(200)
    @contentType('application/json')
    returns (@body pet: Pet ) => pet;

    // any other response is an error and should have a body that describes the error
    @default
    @contentType('application/json')
    returns (@body error: Error ) => throw error;
  }

  @get('/pets/{petId}')
  getPet(petId: int64) : {
    // returns the Pet with the given Id
    @statusCode(200)
    @contentType('application/json')
    returns (@body pet: Pet, @header('x-ms-sequence-nuber') seqNumber: int32 ) => pet;

    // an error when the Pet is not found
    @statusCode(404) 
    returns () => throw PetNotFound;

    // any other response is an error and should have a body that describes the error
    @default
    @contentType('application/json')
    returns (@body error: Error ) => throw error;
  }
}

operation() : {

  returns () => true;
}

// Indicates an Error occured 
model Error {
  // error code value
  code: int32;

  // string message text 
  message: string;
}

// An error when the pet isn't found
model PetNotFound {
  message: 'The pet with the specified Id does not exist';
}

// A Pet in the store. 
model Pet { 
  // system assigned id number
  @readonly id: int64;

  // the name of the pet
  name: string;
  
  // a string with arbitrary tag information 
  @optional tag: string;
}

```



## GRPC Version
``` ts

// grpc Petstore
interface PetStore {

  // List all pets
  // - param limit: How many items to return at one time (max 100)
  @rpc
  listPets(@id(1) @maximum(100) @minimum(0) @optional limit:int32 ) : { 
    // returns the pets in the store, up to the limit specified
    returns (@id(1) pets: Array<Pet>) => pets;
  };

  @rpc
  createPet(@id(1) pet: Pet) : {
    // returns the created Pet (which will contain the id)
    returns (@id(1) pet: Pet ) => pet;
  }

  @rpc
  getPet(@id(1) petId: int64) : {
    // returns the Pet with the given Id
    @oneOf(1, 'pet')                                // uses grpc's oneof and a discriminator field
    returns (@id(2) pet: Pet ) => pet;

    // an error when the Pet is not found
    @oneOf(1, 'notfound')                           // uses grpc's oneof and a discriminator field
    returns () => throw PetNotFound;
  }
}

// An error when the pet isn't found
model PetNotFound {
  message: 'The pet with the specified Id does not exist';
}

// A Pet in the store. 
model Pet { 
  // system assigned id number
  @id(1)
  @readonly 
  id: int64;

  // the name of the pet
  @id(2)
  name: string;
  
  // a string with arbitrary tag information 
  @id(3)
  @optional tag: string;
}
```