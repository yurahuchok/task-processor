import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { PublishRequest } from "../request/PublishRequest";
import { getValidatedInput } from "../util/getValidatedInput";
import { handleError } from "../util/handleError";

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const result = await handleError(
    { procedure: "handler.publish", event },
    async () => (await inject().PublisherService()).publishTask(getValidatedInput(event, PublishRequest))
  );

  if (result.isErr()) {
    return {
      statusCode: result.error._statusCode,
      body: result.error.message,
    };
  }

  return {
    statusCode: 200,
    body: "Task has been published.",
  };
}
