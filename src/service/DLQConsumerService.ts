import type { SQSBatchItemFailure, SQSEvent, SQSRecord } from "aws-lambda";
import type { Logger } from "winston";
import type { TaskRepository } from "../repository/TaskRepository";
import { tolerateError } from "../util/tolerateError";
import type { QueueService } from "./QueueService";

export class DLQConsumerService {
  constructor(
    protected queueService: QueueService,
    protected repository: TaskRepository,
    protected logger: Logger,
  ) {}

  async consumeDLQEvent(event: SQSEvent) {
    const records = event.Records;
    const batchItemFailures: SQSBatchItemFailure[] = [];

    await Promise.all(
      records.map(async (record) => {
        const result = await this.consumeDLQRecord(record);
        if (result === false) {
          batchItemFailures.push({ itemIdentifier: record.messageId });
        }
      }),
    );

    return { batchItemFailures };
  }

  async consumeDLQRecord(record: SQSRecord) {
    const task = await tolerateError({ procedure: "ConsumerService.consumeDLQRecord.task-parse", record }, async () =>
      this.queueService.parseTaskFromRecord(record),
    );

    if (task.isErr()) {
      return false;
    }

    const failure = await tolerateError(
      { procedure: "ConsumerService.consumeDLQRecord.task-parse", record },
      async () => this.repository.getLatestFailureRecord(task.value.id),
    );

    if (failure.isErr()) {
      return false;
    }

    this.logger.info("DLQ Record Received.", { task: task.value, failure: failure.value });
    return true;
  }
}
