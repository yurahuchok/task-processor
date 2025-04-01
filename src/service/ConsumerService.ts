import type { SQSBatchItemFailure, SQSEvent, SQSRecord } from "aws-lambda";
import type { ProcessorService } from "./ProcessorService";
import type { QueueService } from "./QueueService";
import { tolerateError } from "../util/tolerateError";
import { TaskDuplicateError } from "../error/TaskDuplicateError";

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
        if (result === false) {
          batchItemFailures.push({ itemIdentifier: record.messageId });
        }
      }),
    );

    return { batchItemFailures };
  }

  async consumeRecord(record: SQSRecord) {
    const task = await tolerateError(
      { procedure: "ConsumerService.consumeRecord.task-parse", record },
      async () => this.queueService.parseTaskFromRecord(record),
    );

    if (task.isErr()) {
      this.queueService.removeRecordFromQueue(record);
      return false;
    }

    const processingResult = await tolerateError(
      { procedure: "ConsumerService.consumeRecord.task-process", task, record },
      async () => this.processorService.process(task.value),
    );
    
    if (processingResult.isErr()) {
      const internalError = processingResult.error.internal;

      if (internalError instanceof TaskDuplicateError) {
        this.queueService.removeRecordFromQueue(record);
        return false;
      }

      this.queueService.increaseRetryDelayForRecord(record);
      return false;
    }

    return true;
  }
}
