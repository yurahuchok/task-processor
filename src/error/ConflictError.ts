import { BaseError } from "./BaseError";

export class ConflictError extends BaseError<"ConflictError", 409> {
  readonly _type = "ConflictError" as const;

  readonly _statusCode = 409 as const;
}
