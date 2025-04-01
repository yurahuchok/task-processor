import { ProcessorService } from "../../service/ProcessorService";
import { BaseFactory } from "./BaseFactory";
import { TaskRepositoryFactory } from "./TaskRepositoryFactory";

export class ProcessorServiceFactory extends BaseFactory<ProcessorService> {
  static injectionToken = "ProcessorServiceFactory" as const;

  static inject = [TaskRepositoryFactory.injectionToken] as const;

  constructor(protected taskRepositoryFactory: TaskRepositoryFactory) {
    super();
  }

  protected async _make() {
    return new ProcessorService(await this.taskRepositoryFactory.make());
  }
}
