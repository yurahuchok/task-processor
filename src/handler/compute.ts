import { SQSEvent } from "aws-lambda";

export async function handler(event: SQSEvent) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Received ${event.Records.length} records.` }),
  };
}
