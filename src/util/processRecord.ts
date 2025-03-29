import { SQSRecord } from "aws-lambda";
import { getConfig } from "./getConfig";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Task } from "../type/Task";

export async function processRecord(record: SQSRecord) {
  const config = getConfig();
  const client = new DynamoDBClient();

  const task = Task.parse(JSON.parse(record.body));
  console.log("Processing task", JSON.stringify(record));

  const isSuccess = Math.random() > 0.5;

  if (isSuccess) {
    await client.send(new PutItemCommand({
      TableName: config.TABLE_NAME,
      Item: {
        PK: { S: task.id },
        SK: { S: "SUCCESS" },
        payload: { S: JSON.stringify(task.payload) },
      },
      ConditionExpression: "attribute_not_exists(PK)",
    }));
  }

  if (!isSuccess) {
    throw new Error("Task failed");
  }

  return true;
}
