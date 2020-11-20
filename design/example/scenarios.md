


### Post body with multi-part

Imagine a web form with multiple file uploads and maybe some fields. The ADL might look like:

```ts

model LivenessScore {
  // Specifies the liveness classification made by the algorithm.
  // This would be one of the LivenessDecision enumeration values: `Uncertain`, `RealFace` or `SpoofFace`.
  livenessDecision : 'uncertain'|'realface'|'spoofface';
  
  // Specifies the liveness classification score.
  // The values range from 0.0 to 1.0,
  // Where 0.0 implies that the face is a spoof and 1.0 implies that the face is real
  @minimum(0) @maximum(1) score: float32;

  // The face region where the liveness classification was made on
  targetFaceRectangle: FaceRectangle;

  // The file name which contians the face rectangle where the liveness classification was made on
  targetFileName: string;

  // The time offset within the file of the frame which contians the face rectangle where the liveness classification was made on
  targetTimeOffsetWithinFile: int32;
  
  // The image type which contians the face rectangle where the liveness classification was made on
  targetImageType : 'color'|'infrared'|'depth';

  //The model version used by the classification
  modelVersionUsed : '2020-02-15-preview.01'
};

// A rectangle within which a face can be found
model FaceRectangle {
  // The distance from the left edge if the image to the left edge of the rectangle, in pixels
  left: int32;

  // The distance from the top edge if the image to the top edge of the rectangle, in pixels
  top: int32;
  
  // The width of the rectangle, in pixels
  width: int32;

  // The height of the rectangle, in pixels
  height: int32;
}

// The image metadata corresponding to each image in the multi-modal content payload
model ImageData {
  // Describes the image type based on the camera modality
  imageType:  "color" | "infrared" | "depth",

  // The file name of the corresponding Content payload
  @maxLength(255) 
  @minLength(1)
  fileName: string;

  // Required parameter if the file specified is a container of a sequence of images.\r\nThis will be used to locate the target frame in the container.
  @maximum(2147483647)
  @minimum(0)
  timeOffsetWithinFileInMilliseconds : int32;

  // The timestamp of the target frame/image in milliseconds.\r\nThis is needed to understand the relative time differences in between each subsequent frame in the input payload
  @minimum(0)
  @optional
  imageTimestampInMilliseconds : int64
  
  // The target face region where the liveness detection should be focused on
  @optional 
  targetFaceRectangle: FaceRectangle;

  // [skipping these]
  // imageOffsetsIfCropped : ImageCropOffsets
  // imageProperties: ImageProperties
  // imageCreationTimeInMilliseconds : int64
}


interface FaceAPI {
  DetectLiveness(
    @header('Content-Type') 
    mediaType: "multipart/form-data", 

    @multipart('Metadata.ImageType') 
    imageType: "color"|"infrared"|"depth" ,      // a single imageType 

    @multipart('Metadata.ImageData') 
    metadata: Array<MetaData>,                   // multiple MetaData objects serialized as JSON 

    @multipart('Content') 
    @binary 
    content: Array<Array<byte>>,                    // multiple Byte arrays 
  ): Response<LivenessScore>;


  DetectLiveness(
    @header 
    @id(1)
    contentType: "image/jpeg" | "image/png";

    @body('Content') 
    @id(2)
    Content: Array<Byte>;
  ): Response<LivenessScore>;


}


model Image {
  @header 
  @id(1)
  contentType: "image/jpeg" | "image/png";

  @body('Content') 
  @id(2)
  Content: Array<Byte>;
}

model MetaData {
  @multipart('Metadata.ImageType')
  metadata: ImageData;
}

interface FaceAPI {
  DetectLiveness(
    @header('Content-Type') 
    mediaType: "multipart/form-data", 

    @multipart('Metadata.ImageType') 
    imageType: "color"|"infrared"|"depth" ,      // a single imageType 

    @multipart
    data: Array<Image>;

    @multipart
    metadata: Array<Metadata>;

  )
}

```


---

### Binary/arbitrary byte bodies

#### Upload a single binary file with a known media type

use `@binary` to identify a binary blob instead of JSON encoding 

``` ts
@post('/file/{name}')
uploadFile(
    @path 
    name: string, 
    
    @header('Content-Type') 
    mediaType:'image/jpeg', 
    
    @binary 
    @body 
    bytes: Array<byte> );
```

#### upload a single binary file with a choice of media types: 'image/jpeg' or 'image/png'

``` ts
@post('/file/{name}')
uploadFile(@path name: string, 

@header('Content-Type') 
mediaType:'image/jpeg' | 'image/png', 

@binary @body bytes: Array<byte> );
```

#### upload a single binary file with any media type 
``` ts
@post('/file/{name}')
uploadFile(@path name: string, 
@header('Content-Type') mediaType: string, 
@binary @body bytes: Array<byte> );
```


#### upload a string document ( the content is a raw string body)
``` ts
@post('/configuration/{name}')
setConfiguration(
  @header('Content-Type') 
  mediaType: 'application/json',
  
  @path name: string, 
  @raw @body bytes: string ); 
```

### XML bodies
The assumption is that models, unless specifying otherwise, would use JSON serialization

Marking a model with  `@xml` identifies that the model should be serialized with XML serialization

`@attribute` would designate that the property should be encoded as an XML attribute instead of a XML element.

``` ts
@xml
@json 
model MyRequest {
  @attribute
  Id: int32;

  @header('??')  @formdata things: Array<things> 

  @attribute('other-value')
  OtherValue: boolean;

  Name: string;
  Address: Address;
}

@xml 
model Address {
  Street: string;
  City: string;
}
```

Which should provide the following:

``` xml
<MyRequest id='123' other-value='true' >
  <Name>bob</Name>
  <Address>
    <Street>123 anywhere</Street>
    <City>Funkytown</Street>
  </Address>
</MyRequest>
```

and then can be used in an operation: 

``` ts 
@post('/some/path')
doSomethingWithXML(@header('Content-Type') mediaType: 'application/xml', @xml @body: MyRequest);


@post('/some/path')
doSomethingWithXML(@header('Content-Type') mediaType: 'application/json', @json @body: MyRequest);

```

### extensible enum parameter

Marking an enum with `@sealed` should indicates that there shall never be other values

``` ts
enum Type {
  Ruby: 'Ruby';
  Diamond: 'Diamond'
}

enum Sku {
  // The very smallest 
  Small: "*",
  
  // asd
  Big: "8V",
}

@closed
enum OnOrOff {
  On: 'On'
  Off: 'Off'
};

enum Type {
  A: 4,
  B: true
}

class Type {
  private object _value;
  static Type A = new Type(4);
  static Type B = new Type(true);

  private Type(object value) {
    _value = value;
  }
}

@get('/some/path') 
getGemCount(@query type: Type): Response<int32>;

// should we even allow literal types inline (breaking changes)
@get('/some/path') 
getGemCount(@query type: OnOrOff): Response<int32>;

```

### Optional parameters, optional fields in required parameters.

``` ts
@get('/add/numbers')
addNumbers(@query a: int32, @query b: int32, @optional @query c: int32);
```

### optional fields in required parameters
``` ts
model FancyPants {
  @optional age: int32;
  @optional title: string;
  @name: string; 
}

@post('/make/fancypants') 
makeFancyPants(@body pants: FancyPants);
```


# Ouptuts
## Return an image from an api

``` ts
@get('/image/blank')
getBlankImage(@query width: int32, @query height: int32) : {
  @statusCode(200) 
  @mediaType('image/png')
  returns ok(@binary @body image: Array<byte>) => image;

  @default
  returns fail() => throw ApiError;
}
```

### Empty responses

``` ts
interface Accounts {
  nullResponse(): {
    @statusCode(200)
    returns ok()=>void;

    @statusCode(404)
    returns failed() => throw;
  };
}
```

### Primitive body values:

``` ts
 boolResponse(): {
    @statusCode(200)
    returns ok(result: boolean)=>result;

    @statusCode(404)
    returns failed() => throw;
  }
}
```


``` ts
 optionalBoolResponse(): {
    @statusCode(200)
    returns ok(@optional result: boolean)=>result;

    @statusCode(404)
    returns failed() => throw;
  }
}
```


