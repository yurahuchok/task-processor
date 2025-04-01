import { BaseError } from "./BaseError";

export class UnknownError extends BaseError<"UnknownError", 500> {
  readonly _type = "UnknownError" as const;

  readonly _statusCode = 500 as const;
}
