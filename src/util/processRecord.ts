import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import type { SQSRecord } from "aws-lambda";
import { errAsync, fromPromise, okAsync } from "neverthrow";
import { getConfig } from "./getConfig";
import { getDynamoDBClient } from "./getDynamoDBClient";
import { validateTask } from "./validateTask";
import { TaskDuplicateError } from "../error/TaskDuplicateError";
import { TaskProcessingError } from "../error/TaskProcessingError";
import { DynamoDBClientError } from "../error/DynamoDBClientError";

export function processRecord(record: SQSRecord) {
  return okAsync({})
    .andThen((ctx) => {
      return getConfig().map((config) => ({ ...ctx, config }));
    })
    .andThen((ctx) => {
      return getDynamoDBClient().map((client) => ({ ...ctx, client }));
    })
    .andThen((ctx) => {
      return validateTask(record.body).map((task) => ({ ...ctx, task }));
    })
    .andThen((ctx) => {
      const result = fromPromise(
        ctx.client.send(
          new GetItemCommand({
            TableName: ctx.config.TABLE_NAME,
            Key: {
              PK: { S: `TASK#${ctx.task.id}` },
              SK: { S: "STATUS#SUCCESS" },
            },
          }),
        ),
        (error: unknown) => new TaskDuplicateError(error)
      );

      return result.andThen(() => okAsync(ctx));
    })
    .andThen((ctx) => {
      const isSuccess = Math.random() > 0.3;
      if (!isSuccess) {
        return errAsync(new TaskProcessingError("Random failure"));
      }

      return okAsync(ctx);
    })
    .andThen((ctx) => {
      const result = fromPromise(
        ctx.client.send(
          new PutItemCommand({
            TableName: ctx.config.TABLE_NAME,
            Item: {
              PK: { S: `TASK#${ctx.task.id}` },
              SK: { S: "STATUS#SUCCESS" },
              payload: { S: JSON.stringify(ctx.task.payload) },
              ts: { S: new Date().toISOString() },
            },
            ConditionExpression:
              "attribute_not_exists(PK) AND attribute_not_exists(SK)",
          }),
        ),
        (error: unknown) => new DynamoDBClientError(error),
      );

      return result.andThen(() => okAsync(ctx));
    })
    .andThen(() => {
      return okAsync(true);
    });
}
