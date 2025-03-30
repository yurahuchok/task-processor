import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromThrowable } from "neverthrow";
import { DynamoDBClientError } from "../error/DynamoDBClientError";

export function getDynamoDBClient() {
  return fromThrowable(() => new DynamoDBClient(), (error: unknown) => new DynamoDBClientError(error))();
}
  