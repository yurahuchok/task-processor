export class TaskDuplicateError extends Error {
  readonly _type: "TaskDuplicateError" = "TaskDuplicateError";

  constructor(protected internal?: unknown) {
    super("TaskDuplicateError");
  }
}
