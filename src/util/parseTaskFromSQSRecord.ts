import type { SQSRecord } from "aws-lambda";
import { TaskParsingError } from "../error/TaskParsingError";
import { Task } from "../type/Task";

export function parseTaskFromSQSRecord(record: SQSRecord) {
  const result = Task.safeParse(JSON.parse(record.body));
  if (!result.success) {
    throw new TaskParsingError(record, result.error);
  }
  return result.data;
}
