import { TaskService } from "../../service/TaskService";
import { TaskRepositoryFactory } from "./TaskRepositoryFactory";

export class TaskServiceFactory {
  static injectionToken = "TaskServiceFactory" as const;

  static inject = [
    TaskRepositoryFactory.injectionToken
  ] as const;

  constructor(
    protected taskRepositoryFactory: TaskRepositoryFactory,
  ) {}

  make(): TaskService {
    return new TaskService(this.taskRepositoryFactory.make());
  }
}
