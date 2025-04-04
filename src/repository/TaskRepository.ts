import { DeleteItemCommand, type DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { serializeError } from "serialize-error";
import type { Task } from "../type/Task";

export class TaskRepository {
  constructor(
    protected dynamo: DynamoDBClient,
    protected tableName: string,
  ) {}

  async putLockRecord(id: string) {
    return this.dynamo.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: {
          PK: { S: `TASK#${id}` },
          SK: { S: "STATUS#LOCKED" },
          ts: { S: new Date().toISOString() },
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      }),
    );
  }

  async deleteLockRecord(id: string) {
    return this.dynamo.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: {
          PK: { S: `TASK#${id}` },
          SK: { S: "STATUS#LOCKED" },
        },
      }),
    );
  }

  async putFailureRecord(task: Task, error: unknown) {
    const queryResult = await this.getLatestFailureRecord(task.id);

    // TODO. Hacky/ugly/unsafe parsing. Refactor.
    const failureCount = Number.parseInt(queryResult.Items?.pop()?.SK.S?.split("#").pop() ?? "0") + 1;

    return this.dynamo.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: {
          PK: { S: `TASK#${task.id}` },
          SK: {
            S: `STATUS#FAILURE#${String(failureCount).padStart(6, "0")}`,
          },
          payload: { S: JSON.stringify(task.payload) },
          error: { S: JSON.stringify(serializeError(error, { maxDepth: 10 })) },
          ts: { S: new Date().toISOString() },
        },
      }),
    );
  }

  async getLatestFailureRecord(id: string) {
    return await this.dynamo.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": { S: `TASK#${id}` },
          ":sk": { S: "STATUS#FAILURE#" },
        },
        ScanIndexForward: false,
        Limit: 1,
      }),
    );
  }

  async getAllFailureRecords(id: string) {
    return this.dynamo.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": { S: `TASK#${id}` },
          ":sk": { S: "STATUS#FAILURE#" },
        },
        ScanIndexForward: true,
      }),
    );
  }

  async putSuccessRecord(task: Task) {
    return this.dynamo.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: {
          PK: { S: `TASK#${task.id}` },
          SK: { S: "STATUS#SUCCESS" },
          payload: { S: JSON.stringify(task.payload) },
          ts: { S: new Date().toISOString() },
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      }),
    );
  }
}
