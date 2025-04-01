import type { SQSBatchItemFailure, SQSEvent, SQSRecord } from "aws-lambda";
import { okAsync } from "neverthrow";
import { handleError } from "../util/handleError";
import type { ProcessorService } from "./ProcessorService";
import type { QueueService } from "./QueueService";

export class ConsumerService {
  constructor(
    protected queueService: QueueService,
    protected processorService: ProcessorService,
  ) {}

  async consumeEvent(event: SQSEvent) {
    const records = event.Records;
    const batchItemFailures: SQSBatchItemFailure[] = [];

    await Promise.all(
      records.map(async (record) => {
        const result = await this.consumeRecord(record);
        if (result.isErr()) {
          batchItemFailures.push({ itemIdentifier: record.messageId });
        }
      }),
    );

    return { batchItemFailures };
  }

  consumeRecord(record: SQSRecord) {
    return okAsync({})
      .andThen(() => {
        return handleError(
          { procedure: "ConsumerService.consumeRecord.task-parse", record },
          async () => this.queueService.parseTaskFromRecord(record),
        );
      })
      .andThen((task) => {
        return handleError(
          {
            procedure: "ConsumerService.consumeRecord.task-process",
            task,
            record,
          },
          async () => this.processorService.process(task),
        );
      })
      .orElse((error) => {
        return handleError(
          {
            procedure: "ConsumerService.consumeRecord.task-error-post-process",
            error,
            record,
          },
          async () => {
            if (
              error._type === "TaskParsingError" ||
              error._type === "TaskDuplicateError"
            ) {
              this.queueService.removeRecordFromQueue(record);
            } else {
              this.queueService.increaseRetryDelayForRecord(record);
            }
          },
        );
      });
  }
}
