import { BaseError } from "./BaseError";

export class TaskValidationError extends BaseError<"TaskValidationError", 500> {
  readonly _type = "TaskValidationError";
  readonly _statusCode = 500;
}
