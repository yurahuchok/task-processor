import { DeleteItemCommand, type DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { serializeError } from "serialize-error";
import type { Task } from "../../type/Task";
import { FailureRecord } from "./types";

export class TaskRepository {
  constructor(
    protected dynamo: DynamoDBClient,
    protected tableName: string,
  ) {}

  async putLockRecord(id: string) {
    await this.dynamo.send(
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
    await this.dynamo.send(
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
    const failureCount = (await this.getLatestFailureRecord(task.id))?.failureCount ?? 0;

    await this.dynamo.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: {
          PK: { S: `TASK#${task.id}` },
          SK: {
            S: `STATUS#FAILURE#${String(failureCount + 1).padStart(6, "0")}`,
          },
          payload: { S: JSON.stringify(task.payload) },
          error: { S: JSON.stringify(serializeError(error, { maxDepth: 10 })) },
          ts: { S: new Date().toISOString() },
        },
      }),
    );
  }

  async getLatestFailureRecord(id: string) {
    const result = await this.dynamo.send(
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

    const record = result.Items?.[0];
    if (record === undefined) {
      return undefined;
    }

    return FailureRecord.parse({
      id: record?.PK.S,
      payload: record?.payload.S,
      status: "FAILURE",
      failureCount: record?.S,
      error: JSON.parse(record?.error.S ?? "{}"),
    });
  }

  async getAllFailureRecords(id: string) {
    const result = await this.dynamo.send(
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

    return result.Items?.map((item) =>
      FailureRecord.parse({
        id: item.PK.S,
        payload: item.payload.S,
        status: "FAILURE",
        failureCount: item.S,
        error: JSON.parse(item.error.S ?? "{}"),
      }),
    );
  }

  async putSuccessRecord(task: Task) {
    await this.dynamo.send(
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
