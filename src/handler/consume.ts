import { SQSEvent, SQSBatchResponse } from "aws-lambda";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const simulateProcessingForRecords = async () => {
    const results = await Promise.all(event.Records.map(async (record) => {
      const processingTime = Math.random() * (800 - 400) + 400;
      const isSuccess = Math.random() < 0.3;

      await new Promise((resolve) => setTimeout(resolve, processingTime));

      return { messageId: record.messageId, isSuccess };
    }));

    return results;
  };

  const results = await simulateProcessingForRecords();

  return {
    batchItemFailures: results.filter(result => !result.isSuccess).map((result) => ({ itemIdentifier: result.messageId })),
  };
}
