import { BaseError } from "./BaseError";

export class AuthorizationError extends BaseError<"AuthorizationError", 401> {
  readonly _type = "AuthorizationError" as const;

  readonly _statusCode = 401 as const;

  constructor(message?: string, internal?: unknown) {
    super(message ?? "Unauthorized", internal);
  }
}
