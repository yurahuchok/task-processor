import {
  ChangeMessageVisibilityCommand,
  DeleteMessageCommand,
  type SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import type { SQSRecord } from "aws-lambda";
import { TaskParsingError } from "../error/TaskParsingError";
import { Task } from "../type/Task";

export class QueueService {
  constructor(
    protected sqsClient: SQSClient,
    protected queueUrl: string,
  ) {}

  async publishTask(task: Task) {
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(task),
        MessageDeduplicationId: task.id,
      }),
    );
  }

  parseTaskFromRecord(record: SQSRecord) {
    const result = Task.safeParse(JSON.parse(record.body));
    if (!result.success) {
      throw new TaskParsingError(record, result.error);
    }
    return result.data;
  }

  increaseRetryDelayForRecord(record: SQSRecord) {
    return this.sqsClient.send(
      new ChangeMessageVisibilityCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: record.receiptHandle,
        VisibilityTimeout:
          10 + 2 ** Number.parseInt(record.attributes.ApproximateReceiveCount),
      }),
    );
  }

  removeRecordFromQueue(record: SQSRecord) {
    return this.sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: record.receiptHandle,
      }),
    );
  }
}
