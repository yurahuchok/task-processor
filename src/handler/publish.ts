import { PublishRequest } from "../request/PublishRequest";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { getValidatedInput } from "../util/getValidatedInput";
import { ZodError } from "zod";
import { getConfig } from "../util/getConfig";

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const input = getValidatedInput(event, PublishRequest);
    const config = getConfig();

    return {
      statusCode: 200,
      body: JSON.stringify({ task: input }),
    };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    }

    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
