import { ChangeMessageVisibilityCommand, SQSClient } from "@aws-sdk/client-sqs";
import type {
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { safeProcedure } from "../util/safeProcedure";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const result = await safeProcedure(async () => {
    const [queueService, processorService] = await Promise.all([
      inject().QueueService(),
      inject().ProcessorService(),
    ]);

    const batchItemFailures: SQSBatchItemFailure[] = [];

    await Promise.all(
      event.Records.map(async (record) => {
        const task = queueService.getTaskFromRecord(record);
        const result = await safeProcedure(() => processorService.process(task));

        if (result.isErr()) {
          batchItemFailures.push({ itemIdentifier: task.id });
          queueService.increaseRetryDelayForRecord(record);
        }
      }),
    );

    return batchItemFailures;
  });

  if (result.isErr()) {
    throw new Error("Internal Server Error.");
  }

  return {
    batchItemFailures: result.value,
  }
}
