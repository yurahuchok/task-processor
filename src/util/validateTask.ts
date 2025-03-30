import { Task } from "../type/Task";
import { err, ok } from "neverthrow";  
import { TaskValidationError } from "../error/TaskValidationError";

export function validateTask(task: unknown) {
  const result = Task.safeParse(task);

  if (!result.success) {
    return err(new TaskValidationError(result.error));
  }

  return ok(result.data);
}
