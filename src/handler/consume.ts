import { SQSEvent, SQSBatchResponse, SQSBatchItemFailure } from "aws-lambda";
import { processTask } from "../util/processTask";
import { ChangeMessageVisibilityCommand, SQSClient } from "@aws-sdk/client-sqs";
import { getConfig } from "../util/getConfig";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const client = new SQSClient();
  const config = getConfig();
  const batchItemFailures: SQSBatchItemFailure[] = [];

  await Promise.all(
    event.Records.map(async (record) => {
      try {
        await processTask(record);
      } catch (error) {
        batchItemFailures.push({ itemIdentifier: record.messageId });

        await client.send(new ChangeMessageVisibilityCommand({
          QueueUrl: config.QUEUE_URL,
          ReceiptHandle: record.receiptHandle,
          VisibilityTimeout: Math.pow(2, parseInt(record.attributes.ApproximateReceiveCount)),
        }));
      }
    })
  );

  return { batchItemFailures };
}
