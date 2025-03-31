import { Task } from "../type/Task";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import type { SQSEvent, SQSRecord } from "aws-lambda";

export class RetrieveError extends Error {
  constructor(protected internal: unknown) {
    super("RetrieveError");
  }
}

export class QueueService {
  constructor(protected sqsClient: SQSClient, protected queueUrl: string) {}

  async publish(task: Task) {
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(task),
      }),
    )
  }

  retrieveFromRecord(record: SQSRecord) {
    const result = Task.safeParse(JSON.parse(record.body));

    if (!result.success) {
      throw new RetrieveError(result.error);
    }

    return result.data;
  }

  retrieveManyFromEvent(SQSEvent: SQSEvent) {
    return SQSEvent.Records.map((record) => this.retrieveFromRecord(record));
  }
}
