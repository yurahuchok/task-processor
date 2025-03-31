import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { PublishRequest } from "../request/PublishRequest";
import { getValidatedInput } from "../util/getValidatedInput";
import { runHandler } from "../util/runHandler";

export function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  return runHandler(async () => {
    const input = getValidatedInput(event, PublishRequest);

    (await inject().QueueService()).publish(input);

    return {
      statusCode: 200,
      body: JSON.stringify({ task: input }),
    };
  });
}
