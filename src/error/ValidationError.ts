import type { ZodError } from "zod";
import { BaseError } from "./BaseError";

export class ValidationError extends BaseError<"ValidationError", 400> {
  readonly _type = "ValidationError" as const;

  readonly _statusCode = 400 as const;

  constructor(public readonly zodError: ZodError) {
    super(zodError.message);
  }
}
