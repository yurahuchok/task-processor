import { ChangeMessageVisibilityCommand, SQSClient } from "@aws-sdk/client-sqs";
import type {
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { getConfig } from "../util/getConfig";
import { processRecord } from "../util/processRecord";

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

        await client.send(
          new ChangeMessageVisibilityCommand({
            QueueUrl: config.QUEUE_URL,
            ReceiptHandle: record.receiptHandle,
            VisibilityTimeout:
              10 +
              Math.pow(
                2,
                Number.parseInt(record.attributes.ApproximateReceiveCount),
              ),
          }),
        );
      }
    }),
  );

  return { batchItemFailures };
}
