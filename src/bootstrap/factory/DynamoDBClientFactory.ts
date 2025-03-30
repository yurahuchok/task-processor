import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoDBClientFactory {
  static injectionToken = "DynamoDbClientFactory";

  make(): DynamoDBClient {
    return new DynamoDBClient();
  }
}
