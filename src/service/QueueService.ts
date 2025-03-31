import { Task } from "../type/Task";
import { ChangeMessageVisibilityCommand, SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import type { SQSRecord } from "aws-lambda";


export class QueueService {
  constructor(protected sqsClient: SQSClient, protected queueUrl: string) {}

  async publishTask(task: Task) {
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(task),
        MessageDeduplicationId: task.id,
      }),
    )
  }

  getTaskFromRecord(record: SQSRecord) {
    const result = Task.safeParse(JSON.parse(record.body));

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  increaseRetryDelayForRecord(record: SQSRecord) {
    return this.sqsClient.send(
      new ChangeMessageVisibilityCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: record.receiptHandle,
        VisibilityTimeout:
          10 +
          2 ** Number.parseInt(record.attributes.ApproximateReceiveCount),
      })
    );
  }
}
