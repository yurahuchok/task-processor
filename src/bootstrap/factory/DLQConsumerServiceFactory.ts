import { DLQConsumerService } from "../../service/DLQConsumerService";
import { LoggerFactory } from "./LoggerFactory";
import { QueueServiceFactory } from "./QueueServiceFactory";
import { TaskRepositoryFactory } from "./TaskRepositoryFactory";

export class DLQConsumerServiceFactory {
  static injectionToken = "DLQConsumerServiceFactory" as const;

  static inject = [
    QueueServiceFactory.injectionToken,
    TaskRepositoryFactory.injectionToken,
    LoggerFactory.injectionToken,
  ] as const;

  constructor(
    protected queueServiceFactory: QueueServiceFactory,
    protected repositoryFactory: TaskRepositoryFactory,
    protected loggerFactory: LoggerFactory,
  ) {}

  async make() {
    return new DLQConsumerService(
      await this.queueServiceFactory.make(),
      await this.repositoryFactory.make(),
      await this.loggerFactory.make(),
    );
  }
}
