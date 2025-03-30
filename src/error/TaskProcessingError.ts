export class TaskProcessingError extends Error {
  readonly _type: "TaskProcessingError" = "TaskProcessingError";

  constructor(protected internal?: unknown) {
    super("TaskProcessingError");
  }
}
