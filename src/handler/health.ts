import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { tolerateAllErrors } from "../util/tolerateAllErrors";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const result = await tolerateAllErrors(
    { procedure: "handler.health", event },
    async () => {
      await inject().Config(); // Injecting config to check environment configuration.
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "OK" }),
      };
    },
  );

  if (result.isErr()) {
    return { statusCode: result.error._statusCode };
  }

  return result.value;
}
