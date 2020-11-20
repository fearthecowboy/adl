## Built in annotations
- `@optional` - indicates the value is optional
- `@client` indicates the parameter should be specified at a client (aka global level)
- `@method` indicates the parameter should be specified at a method (aka local level)
- `@maximum(n:number)` a constraint where the value should be less than the specified value 
- `@minimum(n:number)` a constraint where the value should be more than the specified value   
- `@default(value:any)` the value that the service will assume if this value is not given
- `@sealed` - indicates that the enum is not extensible
- `@name(n: string)` - overrides the wire name for the property 

## HTTP Protocol Annotations
Notes: 
  - `pathFragment` is a url path fragment 
    must start with either a `/` or `./`  
    if the pathFragment starts with a slash `/` the path is based from the root  
    if the pathFragment starts with a dot-slash `./` the path is based from the parent

- `@location(pathFragment:string)` - the target URL location
  - `pathFragment` - the base path of the location (see `pathFragment` above)

- `@post(pathFragment?:string)` - a POST operation
  - `pathFragment` - optional - the base path of the location. (see `pathFragment` above)

- `@delete(pathFragment?:string)` - a DELETE operation
  - `pathFragment` - optional - the base path of the location. (see `pathFragment` above)

- `@body` indicates an HTTP body parameter/payload

- `@query(wireName?:string)` -  indicates an HTTP query parameter. 
  - `wireName` overrides the name of the parameter on the wire

- `@path(matchName?:string)` -  indicates an HTTP path parameter. 
  - `matchName` the name of the parameter to match in the url template.

- `@skipUrlEncoding ` the value should not be URL encoded.

- `@statusCode(n:string|number)` the status code that the response is matching

## AZURE specific Annotations

  - `@LongRunning` - indicates that the operation is a LongRunning operation an supports the LRO pattern.
  