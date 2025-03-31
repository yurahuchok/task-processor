import { ChangeMessageVisibilityCommand, SQSClient } from "@aws-sdk/client-sqs";
import type {
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";
import { runHandler } from "../util/runHandler";
import { inject } from "../bootstrap/inject";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const result = await runHandler(async () => {
    const [queueService, processorService] = await Promise.all([
      inject().QueueService(),
      inject().ProcessorService(),
    ]);

    const batchItemFailures: SQSBatchItemFailure[] = [];

    await Promise.all(
      queueService.retrieveManyFromEvent(event).map(async (task) => {
        try {
          await processorService.process(task);
        } catch (error) {
          batchItemFailures.push({ itemIdentifier: task.id });
        }
      })
    );

    return {
      statusCode: 200 as const,
      batchItemFailures,
    };
  });

  if (result.statusCode === 200) {
    return {
      batchItemFailures: result.batchItemFailures,
    }
  }

  throw new Error("Internal Server Error.");
}
