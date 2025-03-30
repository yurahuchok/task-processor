export class DynamoDBClientError extends Error {
  readonly _type: "DynamoDBClientError" = "DynamoDBClientError";

  constructor(protected internal?: unknown) {
    super("DynamoDBClientError");
  }
}
