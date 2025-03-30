import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import type { SQSRecord } from "aws-lambda";
import { Task } from "../type/Task";
import { getConfig } from "./getConfig";

export async function processRecord(record: SQSRecord) {
  const config = getConfig();
  const client = new DynamoDBClient();

  const task = Task.parse(JSON.parse(record.body));
  console.log("Processing task", JSON.stringify(record));

  const existingRecord = await client.send(
    new GetItemCommand({
      TableName: config.TABLE_NAME,
      Key: {
        PK: { S: `TASK#${task.id}` },
        SK: { S: `STATUS#SUCCESS` },
      },
    }),
  );

  if (existingRecord.Item) {
    console.log(`Record with ID ${task.id} already exists.`);
    return false;
  }

  const isSuccess = Math.random() > 0.5;

  if (isSuccess) {
    await client.send(
      new PutItemCommand({
        TableName: config.TABLE_NAME,
        Item: {
          PK: { S: `TASK#${task.id}` },
          SK: { S: `STATUS#SUCCESS` },
          payload: { S: JSON.stringify(task.payload) },
          ts: { S: new Date().toISOString() },
        },
        ConditionExpression:
          "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      }),
    );
  }

  if (!isSuccess) {
    throw new Error("Task failed");
  }

  return true;
}
