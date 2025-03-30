import { TaskRepository } from "../../repository/TaskRepository";
import { DynamoDBClientFactory } from "./DynamoDBClientFactory";
import { ConfigServiceFactory } from "./ConfigServiceFactory";

export class TaskRepositoryFactory {
  static injectionToken = "TaskRepositoryFactory";

  static inject = [
    DynamoDBClientFactory.injectionToken,
    ConfigServiceFactory.injectionToken
  ];

  constructor(
    protected dynamoDbClientFactory: DynamoDBClientFactory,
    protected configServiceFactory: ConfigServiceFactory,
  ) {}

  make(): TaskRepository {
    return new TaskRepository(this.dynamoDbClientFactory.make(), this.configServiceFactory.make());
  }
}
