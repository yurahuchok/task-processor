import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { PublishRequest } from "../request/PublishRequest";
import { getValidatedInput } from "../util/getValidatedInput";
import { tolerateAllErrors } from "../util/tolerateAllErrors";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const result = await tolerateAllErrors(
    { procedure: "handler.publish", event },
    async () =>
      (await inject().PublisherService()).publishTask(
        getValidatedInput(event, PublishRequest),
      ),
  );

  if (result.isErr()) {
    if (result.error._type === "ValidationError") {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.error.zodError.format()),
      };
    }

    return { statusCode: result.error._statusCode };
  }

  return { statusCode: 201 };
}
