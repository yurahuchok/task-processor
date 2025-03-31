import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError<"ForbiddenError", 403> {
  readonly _type = "ForbiddenError" as const;

  readonly _statusCode = 403 as const;
}
