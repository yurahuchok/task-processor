import type { SQSBatchResponse, SQSEvent } from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { tolerateAllErrors } from "../util/tolerateAllErrors";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const result = await tolerateAllErrors({ procedure: "handler.consume", event }, async () =>
    (await inject().ConsumerService()).consumeEvent(event),
  );

  if (result.isErr()) {
    throw new Error("Internal Server Error");
  }

  return result.value;
}
