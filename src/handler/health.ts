import { APIGatewayProxyResultV2 } from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { runHandler } from "../util/runHandler";

export function handler(): Promise<APIGatewayProxyResultV2> {
  return runHandler(async () => {
    const _config = await inject().Config(); // Injecting config to check environment configuration.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OK" }),
    };
  });
}
