import { SQSRecord } from "aws-lambda";

export async function processTask(task: SQSRecord) {
  const processingTime = Math.floor(Math.random() * (800 - 400 + 1) + 400);
  await new Promise((resolve) => setTimeout(resolve, processingTime));

  const isSuccess = Math.random() > 0.3;

  if (!isSuccess) {
    throw new Error("Task failed");
  }

  return true;
}
