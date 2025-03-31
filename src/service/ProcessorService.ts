import { TaskRepository } from "../repository/TaskRepository";
import { Task } from "../type/Task";
import { getRandomNumber } from "../util/getRandomNumber";

export class ProcessorService {
  constructor(protected repository: TaskRepository) {}

  async validate(task: Task) {
    const exists = await this.repository.get(task.id);

    if (exists !== undefined) {
      throw new Error("Task ID already exists.");
    }
  }

  async process(task: Task) {
    await this.validate(task);

    // Simulating processing.
    const time = getRandomNumber(100, 200);
    const successRate = 0.3;
    
    const isSuccess = await new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(Math.random() > successRate), time);
    });

    if (isSuccess) {  
      await this.repository.create(task, "SUCCESS");
      return;
    }

    throw new Error("Failed to process task.");
  }
}
