
Required Decorators
===================

## REST decorators
---



### HTTP Methods  
 
  |Signature|Applies To|Purpose|
  |--|--|--|
  |`get(path?:string)`| `operation`| an HTTP GET operation|
  |`put(path?:string)`| `operation`| an HTTP PUT operation|
  |`post(path?:string)`| `operation`| an HTTP POST operation|
  |`delete(path?:string)`| `operation`| an HTTP DELETE operation|
  |`head(path?:string)`| `operation`|  an HTTP HEAD operation|
  |`trace(path?:string)`| `operation`|  an HTTP TRACE operation|
  |`options(path?:string)`| `operation`|  an HTTP OPTIONS operation|
  |`patch(path?:string)`| `operation`|  an HTTP PATCH operation|
  
  > Note: If path is not specified, it would use the path from the parent interface/context

### Parameter implementation   
  Applicability: `parameter`

  |Signature|Applies To|Purpose|
  |--|--|--|
  |`body` | `parameter`| declares the parameter is the HTTP Body parameter.  <br> Must only be one for a given operation|
  |`path(name?:string)`| `parameter`| declares the parameter is a path parameter. <br>If the name is not passed, it will use the parameter name as the key to replace the value in the path
  |`header(name?:string)`| `parameter`| declares the parameter is a header parameter. <br>If the name is not passed, it will use the parameter name as the header key
  |`cookie(name?:string)`| `parameter`| declares the parameter is a cookie parameter. <br>If the name is not passed, it will use the parameter name as the cookie key
  |`multipart()`|`parameter`| declares the value is part of a mulitpart HTTP submission. Must not be used with `body`.
  


## ARM Decorators
---
  If done correctly, we proably only need a couple of resource patterns

  |ResourceType|Implication|
  |--|--|
  |(abstract) `resource`| A resource in ARM. Requires (`id`,`name`,`type`, `properties` - optional `etag`) |
  |`trackedResource`| Resource that's actually tracked by ARM (`location`, `tags`) | 
  |`proxyResource`| Resource that's NOT tracked by ARM (`location`, `tags`) | 
  
  We're going to need:
    - `namespace` (ie, `Microsoft.Compute`)
    - `Name` (ie, `virtualMachine`)
    - The inner `properties` type (ie, `VirtualMachineProperties`)
    - options:
      - subscription-level resource (ie, no resource group)
      - accounting for additional (permitted) properties in resource declaration? (ie, kind, managedBy, identity, sku, plan are permitted in the resource object root, but are not present in all resources)
  

  |Signature|Applies To|Purpose|
  |--|--|--|
  |`trackedResource(namespace:string, resourceName: string,  resourcePropertyType: model)` | `interface` | declares that an interface represents an ARM Resource.|
  |`subResource( resourceName: string,  resourcePropertyType: model)` | `interface` | declares that an interface represents an ARM sub Resource (nested in another resource.) the path will be relative to the parent.|

  Still Needed: LRO variatons, Pageable variations, 

## Common Decorators
---

### Serialization / encoding
  
  |Signature|Applies To|Purpose|
  |--|--|--|
  |`json` | `model`, `parameter` | When placed on a model, indicates that the model supports serialization to/from JSON. <br>When placed on a parameter, indicates that the parameter is to be serialized using JSON.|
  |`xml` | `model`, `parameter`| When placed on a model, indicates that the model supports serialization to/from XML. <br>When placed on a parameter, indicates that the parameter is to be serialized using XML.|
  |`binary` | `parameter`| When placed on a parameter, indicates that the parameter is to be serialized using JSON.<br>Not valid on model delcarations|
  |`skipUrlEncoding` | `parameter` | When placed on a parameter, the parameter should not have it's value URL encoded [See Url Encoding](http://azure.github.io/autorest/extensions/#x-ms-skip-url-encoding) |
  |`base64`| `parameter`, `property` | indicates the value should be encoded as base64 |
  |`rfc1123` | `dateTime` | indicates the value should be encoded as an RFC1123 date time field (instead of a ISO8601)|
  |`unixTime` | `dateTime` | indicates that the value should be encoded as a unixTime value (seconds since Jan 1 1970)|
  |`credential`|`parameter`, `property`| indicates that the value is considered a credential, and special care should be taken regarding it's contents|

  others? (`utf8`, `utf16`, maybe just `encoding(type:string)`?)

  > NOTE: If a model doesn't declare the type of serialization, JSON is assumed.<br>
  Multiple Serialization decorators can be placed on a model, but a parameter may only have one.

### XML Serialization
  |Signature|Applies To|Purpose|
  |--|--|--|
  |`attribute(name?:string)`|`property`| indicates the property should be an XML Attribute in the current model. If the name is specified, use that for the name of the attribute (the default would be the name of the property) |

### Name of an element on the wire 
  |Signature|Applies To|Purpose|
  |--|--|--|
  |`name(wireName: string)` | `parameter`, `property` | overrides the default name to be used on the wire.|

  ``` js
    model foo {
      @name('max-age') // when serialized, it will use 'max-age' as the actual name on the wire. 
      maxAge: number; 
    } 
  ```


### Closed Enums
  |Signature|Applies To|Purpose|
  |--|--|--|
  |`closed`| `enum` | the enum will never have values added to it.|

  ``` js
    @closed  // indicates this enum is forever sealed.
    enum DaysOfTheWeek {
      Monday: 'Monday';
      Tuesday: 'Tuesday';
      Saturday: 'Saturday';
    } 
  ```

### Constraints
  
  |Signature|Applies To|Purpose|
  |--|--|--|
  |`maxLength(len:int32)` |`string` | Indicates the max length of a string.|
  |`minLength(len:int32)` | `string`|Indicates the minimum length of a string.|
  |`maximum(value:number)` | numbers/scalars | indicates the maximum value |
  |`minimum(value:number)` | numbers/scalars |indicates the minimum value |
  |`multipleOf(value:int32)`| numbers/scalars |Property must be a multiple of the given value|  
  |`matches(regex:string)`|`string`|The string must match the regualar expression |
  |`maxItems(value:int32)`|`Array< >`|The maximum number of items in the array   |
  |`minItems(value:int32)` |`Array< >`|The minimum number of items in the array  |
  |`unique` |`Array< >`| the items in the array must be unique |
  |`readonly`| `property` |Property should not be sent|
  |`optional`| `property`, `parameter` |Property/Parameter may be undefined/unspecified|
  |`nullable`| `property`, `parameter` |`null` may be passed for the value of Property/Parameter |
  
  

### Code Generation Hints
  |Signature|Applies To|Purpose|
  |--|--|--|
  |`client`|`parameter` | Indicates the parameter should be generated as a Client (ie, global) Parameter |
  |`discriminator(kind?:string|number)`|`property` | Indicates the property is used as a polymorphic discriminator. If the `kind` is specified, that value is used to select the current model as the type for deserialization  |
  |`requestId(headerName:string)`|`operation`|(?Is this still used) Sets the name of the header that should be used for the request id (defaults to `x-ms-request-id` )|
  |`apiVersion`| `parameter` | indicates that the parameter is used for the API version of the operation | 

