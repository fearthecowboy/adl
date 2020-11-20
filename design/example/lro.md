- lro
- pageable



LRO example:


``` typescript

  model LROStatus<T> {
    link: url;
    partialResult: T;
  }

  model VM {
    // bla bla bla...
  }

  // response for a create/update that may be an LRO 
  response LROResponse<T> {
       // returns the status for the LRO operation
      @statusCode(201)
      @contentType('application/json')
      returns (@body status: LROStatus<Pet> ) => status;

      @statusCode(200)
      @contentType('application/json')
      returns (@body result: T ) => result;

      // any other response is an error and should have a body that describes the error
      @default
      @contentType('application/json')
      returns (@body error: Error ) => throw error;
    }

  @resource('/subscriptions/{subscription}/resourceGroups/etc......')
  interface VirutalMachines {
    @put 
    CreateVM(virtualMachine: VM) : LROResponse<VM>;

    // checks the status of a long running operation. the link comes from the LRO Status 
    @get
    CheckStatus(@url link: url ) : LROResponse<VM>;
  }
```












Pageable: 

``` typescript

```