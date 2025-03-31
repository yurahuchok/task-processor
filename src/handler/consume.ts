import { ChangeMessageVisibilityCommand, SQSClient } from "@aws-sdk/client-sqs";
import type {
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { tolerated } from "../util/tolerated";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const result = await tolerated(async () => {
    const [queueService, processorService] = await Promise.all([
      inject().QueueService(),
      inject().ProcessorService(),
    ]);

    const tasks = queueService.retrieveManyFromEvent(event);
    const batchItemFailures: SQSBatchItemFailure[] = [];

    await Promise.all(
      tasks.map((task) => tolerated(() => processorService.process(task), { taskId: task.id }).mapErr(() => {
        batchItemFailures.push({ itemIdentifier: task.id });
      })),
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
