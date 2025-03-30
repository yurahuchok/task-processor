import { ZodError } from "zod";

export class TaskValidationError extends Error {
  readonly _type: "TaskValidationError" = "TaskValidationError";

  constructor(protected internal: ZodError) {
    super("TaskValidationError");
  }
}
