import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { handleErrors } from "../util/handleErrors";

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const result = await handleErrors(async () => {
    await inject().Config(); // Injecting config to check environment configuration.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OK" }),
    };
  }, { procedure: "handler.health", event });

  if (result.isErr()) {
    return {
      statusCode: result.error._statusCode,
      body: result.error.message,
    };
  }

  return result.value;
}
