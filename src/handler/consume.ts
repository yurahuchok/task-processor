import type {
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { handleErrors } from "../util/handleErrors";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const result = await handleErrors(async () => {
    const [queueService, processorService] = await Promise.all([
      inject().QueueService(),
      inject().ProcessorService(),
    ]);

    const batchItemFailures: SQSBatchItemFailure[] = [];

    await Promise.all(
      event.Records.map(async (record) => {
        const task = queueService.getTaskFromRecord(record);
        const result = await handleErrors(() => processorService.process(task));

        if (result.isErr()) {
          if (result.error._type === "TaskValidationError") {
            await queueService.removeRecordFromQueue(record);
            return;
          }

          batchItemFailures.push({ itemIdentifier: task.id });
          await queueService.increaseRetryDelayForRecord(record);
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
