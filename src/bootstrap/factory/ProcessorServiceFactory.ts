import { ProcessorService } from "../../service/ProcessorService";
import { TaskRepositoryFactory } from "./TaskRepositoryFactory";
import { BaseFactory } from "./BaseFactory";

export class ProcessorServiceFactory extends BaseFactory<ProcessorService> {
  static injectionToken = "ProcessorServiceFactory" as const;

  static inject = [
    TaskRepositoryFactory.injectionToken
  ] as const;

  constructor(protected taskRepositoryFactory: TaskRepositoryFactory) {
    super();
  }

  protected async _make() {
    return new ProcessorService(await this.taskRepositoryFactory.make());
  }
}
