import { TaskDuplicateError } from "../error/TaskDuplicateError";
import { TaskProcessingError } from "../error/TaskProcessingError";
import { TaskResultStorageError } from "../error/TaskResultStorageError";
import type { TaskRepository } from "../repository/TaskRepository";
import type { Task } from "../type/Task";
import { getRandomNumber } from "../util/getRandomNumber";
import { tolerateError } from "../util/tolerateError";

export class ProcessorService {
  constructor(protected repository: TaskRepository) {}

  protected async lock(task: Task) {
    const result = await tolerateError(
      { procedure: "ProcessorService.lock", task },
      async () => {
        await this.repository.create(task, "LOCKED");
      },
    );

    if (result.isErr()) {
      throw new TaskDuplicateError(
        "Task ID already exists in the database. Cannot process.",
        result.error,
      );
    }
  }

  protected async unlock(task: Task) {
    const result = await tolerateError(
      { procedure: "ProcessorService.unlock", task },
      async () => {
        await this.repository.delete(task.id, "LOCKED");
      },
    );

    if (result.isErr()) {
      throw new TaskResultStorageError(
        "Failed to unlock task for further processing.",
        result.error,
      );
    }
  }

  protected async storeSuccess(task: Task) {
    const result = await tolerateError(
      { procedure: "ProcessorService.storeSuccess", task },
      async () => {
        await this.repository.create(task, "SUCCESS");
      },
    );

    if (result.isErr()) {
      throw new TaskResultStorageError(
        "Failed to store task as successful.",
        result.error,
      );
    }
  }

  async process(task: Task) {
    await this.lock(task);

    // Simulating processing.
    const time = getRandomNumber(100, 200);
    const failureRate = 0.3;

    const isSuccess = await new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(Math.random() > failureRate), time);
    });

    if (isSuccess) {
      await this.storeSuccess(task);
      return;
    }

    await this.unlock(task);
    throw new TaskProcessingError("Failed to process task.");
  }
}
