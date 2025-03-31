import { SQSClient } from "@aws-sdk/client-sqs";
import { BaseFactory } from "./BaseFactory";

export class SQSClientFactory extends BaseFactory<SQSClient> {
  static injectionToken = "SQSClientFactory" as const;

  protected async _make() {
    return new SQSClient();
  }
}
