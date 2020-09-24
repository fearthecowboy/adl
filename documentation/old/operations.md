# Operations

## Overview

Individual `Operation`s in an API are grouped together in an `OperationGroup`

## Operation Group

An `OperationGroup` is reprensented as an `interface`, and is a collection of actions that are releated. 
Often, these are grouped around the idea of a `Resource`  (and a `Resource` can be thought of as an extension of a `OperationGroup`)

> example: A simple operation group

``` typescript
/**
 * A simple Pet Store API
 */
export interface PetStore {

  // Operations are delcared inside the operation group
 
} 
```

## Operation

An operation is a implemented as a method delcaration in the `OperationGroup`.

> example: A single operation inside an operation group
``` typescript
/**
 * A simple Pet Store API
 */
export interface PetStore {

  /**
   * Get the number of pets in the store
   * 
   * @http GET /api/count
   */
  getPetCount(): [
    (code: 200)=> {
      body: integer
    }
  ];
} 
```

#### Parameters

Operation parameters are added as parameters in the method declaration.

> example : an operation with multiple parameters.
``` typescript
  /**
   * Create or replace the patching schedule for Redis cache (requires Premium SKU).
   * @http GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/patchSchedules/{schedule}
   * 
   * @param subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @param resourceGroupName - The name of the resource group.
   * @param name - The name of the Redis cache.
   * @param schedule - the patch schedule definition
   * @param apiVersion - Client Api Version.
   * @param parameters - Response to put/get patch schedules for Redis cache
   * 
   * @since 2019-01-01
   */
  createPatchSchedule(subscriptionId: string, resourceGroupName: string, name:string, schedule: Body<PatchSchedule>, apiVersion: Query<string, 'api-version'> ): [Response];
```

These can include any part of the operation, `path`, `query`, `body`, `headers`, and `cookies`.

Unless otherwise indicated with a wrapper, the parameter is assumed to be a `path` parameter.

Parameter Wrapper Types: 
|Wrapper|Descrpition | 
|--|--|
|`Path<type>`|A `Path` parameter substitutes its value in the operaton's PATH (url). The use of `Path<>` around the type is optional, as unadorned parameters are assumed to be `Path` parameters |
|`Query<type,wirename>`|A `Query` parameter adds value in the Query (after the `?` )  -- the wirename defaults to the same name as the parameter name |
|`Cookie<type,wirename>`|A `Cookie` parameter adds value as a Cookie in the request  -- the wirename defaults to the same name as the parameter name |
|`Header<type,wirename>`|A `Header` parameter adds value as a Header in the request  -- the wirename defaults to the same name as the parameter name |
|`Body<type>`|A `Body` parameter encodes it's value as the HTTP request body|

Parameters descriptions are added as `@param` tags in the method's doctag comment.

#### Responses
An operation may declare zero or more expected responses. 

The responses are declared as an array of return values on the method.

``` typescript
  /**
   * Get the number of pets in the store
   * 
   * @http GET /api/pet/{name}/age
   * 
   * @param name the name of the pet to get the age of
   */
  getPetAge(name: string): [

    // a positive response that returns a value
    (code: 200, mediaType: 'application/json'|'text/json')=> {
      body: integer
    },

    // a response that indicates that the operation did not succeed
    (code: 404)=> {
      isException: true,
      message: 'The pet was not found'
    }
  ];

```

Each response can specify criteria for matching the result and the result characteristics.

``` typescript
    ( /* response criteria */)=> {
      /* result definition */
    },
```
##### Response Critera

The Response Critera for an http operation consists of the HTTP status `code` and the body `mediaType`.

``` typescript
    (code: 200|202, mediaType: 'application/json'|'text/json')=> {
       // the result definition
    },
```

##### Result

An HTTP operation result declares the `body` deserialization type, any `headers` that are expected back, and may be marked `isException: true` to indicate that the result is an exception case

``` typescript
  myOperation(...): [

      (code: 204 | 202 | 200, mediaType: 'application/json' | 'text/json') => {
        body: Secret;
        headers: [Header<number, 'x-ms-whatever-count'>]
      },

      (code: '4XX' | 500 | 501, mediaType: 'application/json') => {
        body: CloudError;
        headers: [Header<number, 'x-ms-whatever-count'>, CommonHeaders ]
        isException: true
      },
  ]

```

#### Metadata Information

An operation is decorated with metadata that offers description information about the API, and the connection details (METHOD, PATH) for the operation itself

``` typescript
  /**
   * Create or replace the patching schedule for Redis cache (requires Premium SKU).
   * @http GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/patchSchedules/{default}
   * 
   * @param subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @param resourceGroupName - The name of the resource group.
   * @param name - The name of the Redis cache.
   * @param Default - Default string modeled as parameter for auto generation to work correctly.
   * @param apiVersion - Client Api Version.
   * @param parameters - Response to put/get patch schedules for Redis cache
   * 
   * @since 2019-01-01
   */
```

Standard documentation and version tags can be used (`@description`, `@since`, etc.. ) as well as other well known doctags: 

|Tag|Descrpition | 
|--|--|
|`@http <OPERATION> <PATH>`|specified the HTTP operation and path. <br>example: `@http GET /foo/bar/bin/baz` |
|`@param <PARAMETER>`|sets the description for a given parameter in the operation |
|`@tag`|A costmetic descriptive tag (maps to OpenAPI operation `tag`)  |

Other OpenAPI extensions (ie, 'x-foo' ) may be expressed as `@x-foo <value>` tags.



#### Overloading
Operation groups may have multiple operations with the same name that can be used to document different variations of an operation.

Overloads can have different versioning metata (`@since`/`@deleted`/`@deprecated`, etc) and may have the same or different paramters and responses.

``` typescript
/**
 * A simple Pet Store API
 */
export interface PetStore {

  /**
   * Checks to see if a name is available
   * @http POST /api/checkName/{name}
   * 
   * @param name - the name to check
   */
  checkName(name: string): [
    (code: 200)=> {
      body: boolean
    }
  ];

  /**
   * Checks to see if a name is available, and pass an alternate name to check
   * @http GET /api/checkName/{name}
   * 
   * @param name - the name to check
   * @param alternateName - an alternate Name to check 
   * @since v2
   */
  checkName(name: string, alternateName Query<string, 'alternate-name'>): [
    (code: 200)=> {
      body: boolean
    }
  ];
} 

```


## Other Examples

``` typescript
// example creating a standard response declaration that can be reused

  /** ... */
  CreateOrUpdate(
    subscriptionId: string,
    resourceGroupName: string,
    vaultName: string & RegularExpression<'^[a-zA-Z0-9-]{3,24}$'>,
    secretName: string & RegularExpression<'^[a-zA-Z0-9-]{1,127}$'>,
    api_version: Query<string, 'api-version'>,
    parameters: Body<Secret>): StandardResponse<Secret>;


// that is templated 
type StandardResponse<T> = [ArmResponse<Secret>, ResponseError];

// a response alias can be created
type ArmResponse<T> = (code: 200, mediaType: 'application/json') => {
  body: T;
  headers: Header<number, 'x-ms-whatever-count'>
}

// a typical error handler
type ResponseError = (code: 400|500, mediaType: 'application/json') => {
  body: CloudError;
  headers: Header<number, 'x-ms-whatever-count'>,
  isException: true,
}


```


 