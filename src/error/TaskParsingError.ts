import type { SQSRecord } from "aws-lambda";
import { BaseError } from "./BaseError";

export class TaskParsingError extends BaseError<"TaskParsingError", 500> {
  readonly _type = "TaskParsingError";

  readonly _statusCode = 500;

  constructor(
    protected record: SQSRecord,
    error: unknown,
  ) {
    super("Task could not be parsed from queue.", error);
  }
}
