import type { SQSBatchItemFailure, SQSEvent, SQSRecord } from "aws-lambda";
import { TaskDuplicateError } from "../error/TaskDuplicateError";
import { parseTaskFromSQSRecord } from "../util/parseTaskFromSQSRecord";
import { tolerateError } from "../util/tolerateError";
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
        if (result === false) {
          batchItemFailures.push({ itemIdentifier: record.messageId });
        }
      }),
    );

    return { batchItemFailures };
  }

  async consumeRecord(record: SQSRecord) {
    const task = await tolerateError({ procedure: "ConsumerService.consumeRecord.task-parse", record }, async () =>
      parseTaskFromSQSRecord(record),
    );

    if (task.isErr()) {
      await this.queueService.removeRecordFromQueue(record);
      return false;
    }

    const processingResult = await tolerateError(
      { procedure: "ConsumerService.consumeRecord.task-process", task, record },
      () => this.processorService.process(task.value),
    );

    if (processingResult.isErr()) {
      if (processingResult.error.internal instanceof TaskDuplicateError) {
        await this.queueService.removeRecordFromQueue(record);
        return false;
      }

      await this.queueService.increaseRetryDelayForRecord(record);
      return false;
    }

    return true;
  }
}
