import { TaskDuplicateError } from "../error/TaskDuplicateError";
import { TaskProcessingError } from "../error/TaskProcessingError";
import { TaskResultStorageError } from "../error/TaskResultStorageError";
import type { TaskRepository } from "../repository/TaskRepository";
import type { Task } from "../type/Task";

export class ProcessorService {
  constructor(protected repository: TaskRepository) {}

  protected async lock(task: Task) {
    try {
      await this.repository.putLockRecord(task.id);
    } catch (error: unknown) {
      throw new TaskDuplicateError("Task ID already exists in the database. Cannot process.", error);
    }
  }

  protected async unlock(task: Task) {
    try {
      await this.repository.deleteLockRecord(task.id);
    } catch (error: unknown) {
      throw new TaskResultStorageError("Failed to unlock task for further processing.", error);
    }
  }

  protected async storeSuccess(task: Task) {
    try {
      await this.repository.putSuccessRecord(task);
    } catch (error: unknown) {
      throw new TaskResultStorageError("Failed to store task as successful.", error);
    }
  }

  protected async storeFailure(task: Task, failureCauseError: unknown) {
    try {
      await this.repository.putFailureRecord(task, failureCauseError);
    } catch (storageError: unknown) {
      throw new TaskResultStorageError("Failed to store task as failed.", { storageError, failureCauseError });
    }
  }

  protected async simulateProcessing(task: Task) {
    const failureChance = task.payload.simulation?.failureChance ?? 0.3;
    const executionTime = Math.min(Math.max(task.payload.simulation?.executionTime ?? 0, 0), 1000);
    
    const isSuccess = await new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(Math.random() > failureChance), executionTime);
    });

    if (!isSuccess) {
      throw Error("Simulated failure.");
    }
  }

  async process(task: Task) {
    await this.lock(task);

    try {
      await this.simulateProcessing(task);
    } catch (error: unknown) {
      await this.unlock(task);

      const taskProcessingError = new TaskProcessingError("Failed to process task.", error);
      await this.storeFailure(task, taskProcessingError);

      throw taskProcessingError;
    }

    await this.storeSuccess(task);
    return;
  }
}
