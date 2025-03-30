import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Task } from "../type/Task";
import { ConfigService } from "../service/ConfigService";

export class TaskRepository {
  constructor(protected dynamo: DynamoDBClient, protected config: ConfigService) {}

  async getTask(id: string): Promise<Task | undefined> {
    const result = await this.dynamo.send(
      new GetItemCommand({
        TableName: this.config.get().TABLE_NAME,
        Key: {
          id: { S: id },
        },
      }),
    );

    if (result.Item === undefined) {
      return undefined;
    }

    return Task.parse(result.Item);
  }

  async saveTask(task: Task, status: "SUCCESS") {
    await this.dynamo.send(
      new PutItemCommand({
        TableName: this.config.get().TABLE_NAME,
        Item: {
          PK: { S: `TASK#${task.id}` },
          SK: { S: `STATUS#${status}` },
          payload: { S: JSON.stringify(task.payload) },
          ts: { S: new Date().toISOString() },
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      }),
    );
  }
}
