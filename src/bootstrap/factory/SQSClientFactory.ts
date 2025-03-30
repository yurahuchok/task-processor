import { SQSClient } from "@aws-sdk/client-sqs";

export class SQSClientFactory {
  static injectionToken = "SQSClientFactory" as const;

  make(): SQSClient {
    return new SQSClient();
  }
}
