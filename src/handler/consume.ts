import type {
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { handleErrors } from "../util/handleErrors";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const result = await handleErrors(
    { procedure: "handler.consume", event },
    async () => {
      const [queueService, processorService] = await Promise.all([
          inject().QueueService(),
          inject().ProcessorService(),
      ]);

      const failures: SQSBatchItemFailure[] = [];

      await Promise.all(
        event.Records.map(async (record) => {
          const task = await handleErrors(
            { procedure: "handler.consume.task-parse", record },
            async () => queueService.parseTaskFromRecord(record),
          );
          
          if (task.isErr()) {
            if (task.error._type === "TaskParsingError") {
              return await queueService.removeRecordFromQueue(record);
            } else {
              return queueService.increaseRetryDelayForRecord(record);
            }
          }
          
          const process = await handleErrors(
            { procedure: "handler.consume.task-process", task, record },
            () => processorService.process(task.value),
          );
          
          if (process.isErr()) {
            if (process.error._type === "TaskDuplicateError") {
              return await queueService.removeRecordFromQueue(record);
            } else {
              return queueService.increaseRetryDelayForRecord(record);
            }
          }
        }),
      );

      return { batchItemFailures: failures };
    }
  );

  if (result.isErr()) {
    throw new Error("Internal Server Error.");
  }

  return result.value;
}



