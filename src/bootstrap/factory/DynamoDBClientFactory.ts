import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoDBClientFactory {
  static injectionToken = "DynamoDbClientFactory" as const;

  make(): DynamoDBClient {
    return new DynamoDBClient();
  }
}
