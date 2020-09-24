
Types in ADL 
===================

## primitive types

|ADL Primitive Type| Description|
|--|--|
|`boolean`| The most basic datatype is the simple `true`/`false` value|
|`string`| As in other languages, we use the type `string` to refer to these textual datatypes |
|`byte` or `int8` | Integer with 8 bit-precision |
|`int16` | Integer with 16 bit-precision |
|`int32` | Integer with 32 bit-precision |
|`int64` | Integer with 64 bit-precision |
|`float32`| 32-bit precision floating point number |
|`float64`| 64-bit precision floating point number |
|`char`| a single character |
|`date`| an ISO 8601 date |
|`datetime`| an ISO 8601 Date time |
|`time`| an ISO 8601 time |
|`duration`| a duration value |
|`uuid`| A UUID/GUID string |
|`uri`| and URI string |
|`any` | some data isn't actually typed or supports literally any value. For this, use the `any` type (be forewarned, generating code against such properties is often less than satisfactory.) |
|`unknown` | the type of data isn't known -- should not be used on values sent to the service (be forewarned, generating code against such properties is often less than satisfactory.) |

## Collection Types

|ADL Primitive Type| Description|
|--|--|
|`Array<T>` | an Array of `T` elements |
|`Dictionary<T>` | an key/value map of `T` elements  (keys are always strings)|

