import { TaskService } from "../../service/TaskService";
import { TaskRepositoryFactory } from "./TaskRepositoryFactory";

export class TaskServiceFactory {
  static injectionToken = "TaskServiceFactory";

  static inject = [
    TaskRepositoryFactory.injectionToken
  ];

  constructor(
    protected taskRepositoryFactory: TaskRepositoryFactory,
  ) {}

  make(): TaskService {
    return new TaskService(this.taskRepositoryFactory.make());
  }
}
