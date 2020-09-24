type integer = number;


let XRateLimitLimit: integer;

namespace headers {
  /** 
   * The number of allowed requests in the current period 
   * 
   * @serializedName X-Rate-Limit-Limit
   */
  type XRateLimitLimit = integer;
}

/** declared headers for the entire API  */
interface Headers {

  /** The number of allowed requests in the current period  */
  'X-Rate-Limit-Limit': integer;

  /** The number of remaining requests in the current period  */
  'X-Rate-Limit-Remaining': integer;

  /** The number of seconds left in the current period  */
  'X-Rate-Limit-Reset': integer;
}


interface MyOperationHeaders {
  /** The number of seconds left in the current period  */
  'X-Rate-Limit-Reset': integer;
}

class myOperations {
  foo: (subId: number) =>
    Response<201> & MyOperationHeaders;

}