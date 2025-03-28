import { SubmitRequest } from "../request/SubmitRequest";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { getValidatedInput } from "../util/getValidatedInput";

export async function handler(event: APIGatewayProxyEventV2) {
  const input = getValidatedInput(event, SubmitRequest);

  return {
    statusCode: 200,
    body: JSON.stringify({ task: input }),
  };
}
