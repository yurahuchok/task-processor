import { DLQConsumerService } from "../../service/DLQConsumerService";
import { LoggerFactory } from "./LoggerFactory";
import { TaskRepositoryFactory } from "./TaskRepositoryFactory";

export class DLQConsumerServiceFactory {
  static injectionToken = "DLQConsumerServiceFactory" as const;

  static inject = [TaskRepositoryFactory.injectionToken, LoggerFactory.injectionToken] as const;

  constructor(
    protected repositoryFactory: TaskRepositoryFactory,
    protected loggerFactory: LoggerFactory,
  ) {}

  async make() {
    return new DLQConsumerService(await this.repositoryFactory.make(), await this.loggerFactory.make());
  }
}
