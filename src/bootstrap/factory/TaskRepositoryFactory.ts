import { TaskRepository } from "../../repository/TaskRepository";
import { DynamoDBClientFactory } from "./DynamoDBClientFactory";
import { ConfigFactory } from "./ConfigFactory";

export class TaskRepositoryFactory {
  static injectionToken = "TaskRepositoryFactory" as const;

  static inject = [
    DynamoDBClientFactory.injectionToken,
    ConfigFactory.injectionToken,
  ] as const;

  constructor(
    protected dynamoDbClientFactory: DynamoDBClientFactory,
    protected configFactory: ConfigFactory,
  ) {}

  make(): TaskRepository {
    return new TaskRepository(this.dynamoDbClientFactory.make(), this.configFactory.make().TABLE_NAME);
  }
}
