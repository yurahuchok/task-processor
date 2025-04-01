import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BaseFactory } from "./BaseFactory";

export class DynamoDBClientFactory extends BaseFactory<DynamoDBClient> {
  static injectionToken = "DynamoDbClientFactory" as const;

  protected async _make() {
    return new DynamoDBClient();
  }
}
