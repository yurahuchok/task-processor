import {
  type DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Task } from "../type/Task";

export class TaskRepository {
  constructor(
    protected dynamo: DynamoDBClient,
    protected tableName: string,
  ) {}

  async get(id: string): Promise<Task | undefined> {
    const result = await this.dynamo.send(
      new GetItemCommand({
        TableName: this.tableName,
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

  async create(task: Task, status: "SUCCESS") {
    return this.dynamo.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: {
          PK: { S: `TASK#${task.id}` },
          SK: { S: `STATUS#${status}` },
          payload: { S: JSON.stringify(task.payload) },
          ts: { S: new Date().toISOString() },
        },
        ConditionExpression:
          "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      }),
    );
  }
}
