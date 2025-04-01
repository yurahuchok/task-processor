import { BaseError } from "./BaseError";

export class TaskDuplicateError extends BaseError<"TaskDuplicateError", 500> {
  readonly _type = "TaskDuplicateError";
  
  readonly _statusCode = 500;
}
