import { Logger } from "winston";
import { fromPromise } from "neverthrow";
import { BadRequestError } from "../error/BadRequestError";
import { AuthorizationError } from "../error/AuthorizationError";
import { ForbiddenError } from "../error/ForbiddenError";
import { NotFoundError } from "../error/NotFoundError";
import { ServiceError } from "../error/ServiceError";
import { ValidationError } from "../error/ValidationError";
import { ConflictError } from "../error/ConflictError";

export class RuntimeService {
  constructor(protected logger: Logger) {}

  safeExecute<T>(fn: () => Promise<T>) {
    return fromPromise(fn(), (error: unknown) => {
      if (error instanceof ValidationError) {
        this.logger.info("handleError: ValidationError occurred", { error });
        return {
          statusCode: 400,
          body: JSON.stringify(error.zodError.format()),
        };
      } else if (error instanceof BadRequestError) {
        this.logger.info("handleError: BadRequestError occurred", { error });
        return {
          statusCode: 400,
          body: error.message,
        };
      } else if (error instanceof AuthorizationError) {
        this.logger.info("handleError: AuthorizationError occurred", { error });
        return {
          statusCode: 401,
          body: error.message,
        };
      } else if (error instanceof ForbiddenError) {
        this.logger.warn("handleError: ForbiddenError occurred", { error });
        return {
          statusCode: 403,
          body: error.message,
        };
      } else if (error instanceof NotFoundError) {
        this.logger.info("handleError: NotFoundError occurred", { error });
        return {
          statusCode: 404,
          body: error.message,
        };
      } else if (error instanceof ConflictError) {
        this.logger.info("handleError: ConflictError occurred", { error });
        return {
          statusCode: 409,
          body: error.message,
        };
      } else if (error instanceof ServiceError) {
        this.logger.error("handleError: ServiceError occurred", { error });
        return {
          statusCode: 500,
          body: "Internal Server Error",
        };
      }

      this.logger.error("handleError: Unexpected error occurred", { error });
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    });
  }
}
