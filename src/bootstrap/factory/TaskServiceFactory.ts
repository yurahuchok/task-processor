import { ProcessorService } from "../../service/ProcessorService";
import { TaskRepositoryFactory } from "./TaskRepositoryFactory";

export class ProcessorServiceFactory {
  static injectionToken = "ProcessorServiceFactory" as const;

  static inject = [
    TaskRepositoryFactory.injectionToken
  ] as const;

  constructor(
    protected taskRepositoryFactory: TaskRepositoryFactory,
  ) {}

  make() {
    return new ProcessorService(this.taskRepositoryFactory.make());
  }
}
