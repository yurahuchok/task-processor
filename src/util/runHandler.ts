import { safeExecute } from "./safeExecute";
import { inject } from "../bootstrap/inject";

export async function runHandler<T>(fn: () => Promise<T>) {
  const logger = await safeExecute(inject().Logger);
  if (logger.isErr()) {
    console.log("Error occurred while injecting Logger instance.", logger.error);
    return {
      statusCode: 500 as const,
      body: "Internal Server Error.",
    };
  }

  return safeExecute(fn).match(
    (result) => result,
    (error) => {
      switch (error._type) {
        case "ValidationError":
          logger.value.info("handler: ValidationError occurred", { error });
          return {
            statusCode: error._statusCode,
            body: JSON.stringify(error.zodError.format()),
          };
        case "BadRequestError":
          logger.value.info("handler: BadRequestError occurred", { error });
          return {
            statusCode: error._statusCode,
            body: error.message,
          };
        case "AuthorizationError":
          logger.value.info("handler: AuthorizationError occurred", { error });
          return {
            statusCode: error._statusCode,
            body: error.message,
          };
        case "ForbiddenError":
          logger.value.warn("handler: ForbiddenError occurred", { error });
          return {
            statusCode: error._statusCode,
            body: error.message,
          };
        case "NotFoundError":
          logger.value.info("handler: NotFoundError occurred", { error });
          return {
            statusCode: error._statusCode,
            body: error.message,
          };
        case "ConflictError":
          logger.value.info("handler: ConflictError occurred", { error });
          return {
            statusCode: error._statusCode,
            body: error.message,
          };
        case "ServiceError":
          logger.value.error("handler: ServiceError occurred", { error });
          return {
            statusCode: error._statusCode,
            body: "Internal Server Error",
          };
      }
    },
  );
}