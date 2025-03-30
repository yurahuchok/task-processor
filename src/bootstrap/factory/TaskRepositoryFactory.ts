import { TaskRepository } from "../../repository/TaskRepository";
import { DynamoDBClientFactory } from "./DynamoDBClientFactory";
import { ConfigServiceFactory } from "./ConfigServiceFactory";

export class TaskRepositoryFactory {
  static injectionToken = "TaskRepositoryFactory" as const;

  static inject = [
    DynamoDBClientFactory.injectionToken,
    ConfigServiceFactory.injectionToken,
  ] as const;

  constructor(
    protected dynamoDbClientFactory: DynamoDBClientFactory,
    protected configServiceFactory: ConfigServiceFactory,
  ) {}

  make(): TaskRepository {
    return new TaskRepository(this.dynamoDbClientFactory.make(), this.configServiceFactory.make());
  }
}
