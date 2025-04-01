import { BaseError } from "./BaseError";

export class TaskProcessingError extends BaseError<"TaskProcessingError", 500> {
  readonly _type = "TaskProcessingError";

  readonly _statusCode = 500;
}
