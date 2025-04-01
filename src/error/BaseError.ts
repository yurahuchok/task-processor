export abstract class BaseError<
  TType extends string,
  TCode extends number,
> extends Error {
  abstract readonly _type: TType;

  abstract readonly _statusCode: TCode;

  constructor(
    message?: string,
    public readonly internal?: unknown,
  ) {
    super(message);
  }
}
