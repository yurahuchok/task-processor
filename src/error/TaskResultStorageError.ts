import { BaseError } from "./BaseError";

export class TaskResultStorageError extends BaseError<
  "TaskResultStorageError",
  500
> {
  readonly _type = "TaskResultStorageError";

  readonly _statusCode = 500;
}
