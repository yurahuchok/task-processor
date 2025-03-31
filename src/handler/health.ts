import { APIGatewayProxyResultV2 } from "aws-lambda";
import { inject } from "../bootstrap/inject";
import { safeProcedure } from "../util/safeProcedure";

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const result = await safeProcedure(async () => {
   await inject().Config(); // Injecting config to check environment configuration.
   
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OK" }),
    };
  });

  if (result.isErr()) {
    return {
      statusCode: result.error._statusCode,
      body: result.error.message,
    };
  }

  return result.value;
}
