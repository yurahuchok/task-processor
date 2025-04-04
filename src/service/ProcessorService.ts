import { TaskDuplicateError } from "../error/TaskDuplicateError";
import { TaskProcessingError } from "../error/TaskProcessingError";
import { TaskResultStorageError } from "../error/TaskResultStorageError";
import type { TaskRepository } from "../repository/TaskRepository";
import type { Task } from "../type/Task";
import { tolerateError } from "../util/tolerateError";

export class ProcessorService {
  constructor(protected repository: TaskRepository) {}

  protected async lock(task: Task) {
    const result = await tolerateError({ procedure: "ProcessorService.lock", task }, async () => {
      await this.repository.putLockRecord(task.id);
    });

    if (result.isErr()) {
      throw new TaskDuplicateError("Task ID already exists in the database. Cannot process.", result.error);
    }
  }

  protected async unlock(task: Task) {
    const result = await tolerateError({ procedure: "ProcessorService.unlock", task }, async () => {
      await this.repository.deleteLockRecord(task.id);
    });

    if (result.isErr()) {
      throw new TaskResultStorageError("Failed to unlock task for further processing.", result.error);
    }
  }

  protected async storeSuccess(task: Task) {
    const result = await tolerateError({ procedure: "ProcessorService.storeSuccess", task }, async () => {
      await this.repository.putSuccessRecord(task);
    });

    if (result.isErr()) {
      throw new TaskResultStorageError("Failed to store task as successful.", result.error);
    }
  }

  protected async storeFailure(task: Task, error: unknown) {
    const result = await tolerateError({ procedure: "ProcessorService.storeFailure", task, error }, async () => {
      await this.repository.putFailureRecord(task, error);
    });

    if (result.isErr()) {
      throw new TaskResultStorageError("Failed to store task as failed.", result.error);
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
