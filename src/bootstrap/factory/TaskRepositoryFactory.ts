import { TaskRepository } from "../../repository/TaskRepository";
import { DynamoDBClientFactory } from "./DynamoDBClientFactory";
import { ConfigFactory } from "./ConfigFactory";
import { BaseFactory } from "./BaseFactory";

export class TaskRepositoryFactory extends BaseFactory<TaskRepository> {
  static injectionToken = "TaskRepositoryFactory" as const;

  static inject = [
    DynamoDBClientFactory.injectionToken,
    ConfigFactory.injectionToken,
  ] as const;

  constructor(
    protected dynamoDbClientFactory: DynamoDBClientFactory,
    protected configFactory: ConfigFactory,
  ) {
    super();
  }

  protected async _make() {
    return new TaskRepository(await this.dynamoDbClientFactory.make(), (await this.configFactory.make()).TABLE_NAME);
  }
}
