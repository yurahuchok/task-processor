export abstract class BaseError<TType extends string, TCode extends number> extends Error {
  readonly abstract _type: TType;

  readonly abstract _statusCode: TCode;
  
  constructor(
    message?: string,
    public readonly internal?: unknown,
  ) {
    super(message);
  }
}
