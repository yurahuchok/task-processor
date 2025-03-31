import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError<"BadRequestError", 400> {
  readonly _type = "BadRequestError" as const;

  readonly _statusCode = 400 as const;
}
