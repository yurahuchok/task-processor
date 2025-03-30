import { TaskRepository } from "../repository/TaskRepository";
import { Task } from "../type/Task";

export class TaskService {
  constructor(protected repository: TaskRepository) {}

  async validate(task: unknown) {
    const parsed = Task.safeParse(task);
    if (!parsed.success) {
      throw new Error("Invalid task");
    }

    const exists = await this.repository.getTask(parsed.data.id);
    if (exists !== undefined) {
      throw new Error("Task already exists");
    }

    return parsed.data;
  }

  async process(task: Task) {
    const isSuccess = Math.random() > 0.3;

    if (isSuccess) {  
      this.recordSuccess(task);
    }
  }

  async recordSuccess(task: Task) {
    await this.repository.saveTask(task, "SUCCESS");
  }
}
