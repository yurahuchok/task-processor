import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { ZodObject } from "zod";

type InputContainer<
  TParams extends ZodObject<any>,
  TQuery extends ZodObject<any>,
  TBody extends ZodObject<any>,
  THeaders extends ZodObject<any>,
> = { query?: TQuery; body?: TBody; params?: TParams; headers?: THeaders };

type ZodInput = ZodObject<InputContainer<any, any, any, any>>;

export function getValidatedInput<Z extends ZodInput>(
  event: APIGatewayProxyEventV2,
  z: Z,
): Z["_output"]["query"] &
  Z["_output"]["body"] &
  Z["_output"]["params"] &
  Z["_output"]["headers"] {
  const result = z.safeParse({
    query: event.queryStringParameters,
    body: event.body,
    params: event.pathParameters,
    headers: event.headers,
  });

  if (!result.success) {
    throw result.error;
  }

  return {
    ...result.data.query,
    ...result.data.body,
    ...result.data.params,
    ...result.data.headers,
  };
}
