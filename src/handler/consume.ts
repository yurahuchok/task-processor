import { SQSEvent, SQSBatchResponse, SQSBatchItemFailure } from "aws-lambda";
import { processRecord } from "../util/processRecord";
import { ChangeMessageVisibilityCommand, SQSClient } from "@aws-sdk/client-sqs";
import { getConfig } from "../util/getConfig";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const client = new SQSClient();
  const config = getConfig();
  const batchItemFailures: SQSBatchItemFailure[] = [];

  await Promise.all(
    event.Records.map(async (record) => {
      try {
        await processRecord(record);
      } catch (error) {
        batchItemFailures.push({ itemIdentifier: record.messageId });

        await client.send(new ChangeMessageVisibilityCommand({
          QueueUrl: config.QUEUE_URL,
          ReceiptHandle: record.receiptHandle,
          VisibilityTimeout: 10 + Math.pow(2, parseInt(record.attributes.ApproximateReceiveCount)),
        }));
      }
    })
  );

  return { batchItemFailures };
}
