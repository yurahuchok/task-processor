import {
  ChangeMessageVisibilityCommand,
  DeleteMessageCommand,
  type SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import type { SQSRecord } from "aws-lambda";
import type { Task } from "../type/Task";

export class QueueService {
  constructor(
    protected sqsClient: SQSClient,
    protected queueUrl: string,
  ) {}

  async publishTask(task: Task) {
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,

        /**
         * NOTE.
         * We can use FIFO queue to have deduplication, but it's too much overhead for this use case IMO.
         * So instead, opting for a simple queue and handling deduplication only at the consumer level (DynamoDB).
         */
        // MessageGroupId: task.id,
        // MessageDeduplicationId: task.id,

        MessageBody: JSON.stringify(task),
      }),
    );
  }

  increaseRetryDelayForRecord(record: SQSRecord) {
    return this.sqsClient.send(
      new ChangeMessageVisibilityCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: record.receiptHandle,
        VisibilityTimeout: 60 * 2 ** (Number.parseInt(record.attributes.ApproximateReceiveCount) - 1),
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
