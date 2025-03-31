import { BaseError } from "./BaseError";

export class ServiceError extends BaseError<"ServiceError", 500> {
  readonly _type = "ServiceError" as const;

  readonly _statusCode = 500 as const;
}
