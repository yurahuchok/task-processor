export abstract class BaseError<T extends string> extends Error {
  readonly abstract _type: T;
}
