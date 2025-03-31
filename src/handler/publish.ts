import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { PublishRequest } from "../request/PublishRequest";
import { getValidatedInput } from "../util/getValidatedInput";
import { handleErrors } from "../util/handleErrors";

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const result = await handleErrors(
    { procedure: "handler.publish", event },
    async () => {
      const input = getValidatedInput(event, PublishRequest);
      (await inject().QueueService()).publishTask(input);
      return { task: input };
    }
  );

  if (result.isErr()) {
    return {
      statusCode: result.error._statusCode,
      body: result.error.message,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.value),
  };
}
