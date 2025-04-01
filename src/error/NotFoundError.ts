import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError<"NotFoundError", 404> {
  readonly _type = "NotFoundError" as const;

  readonly _statusCode = 404 as const;
}
