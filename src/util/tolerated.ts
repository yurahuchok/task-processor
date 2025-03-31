import { err, fromPromise, okAsync } from "neverthrow";
import { AuthorizationError } from "../error/AuthorizationError";
import { BadRequestError } from "../error/BadRequestError";
import { ConflictError } from "../error/ConflictError";
import { ForbiddenError } from "../error/ForbiddenError";
import { NotFoundError } from "../error/NotFoundError";
import { ServiceError } from "../error/ServiceError";
import { ValidationError } from "../error/ValidationError";
import { inject } from "../bootstrap/inject";

export function tolerated<T>(fn: () => Promise<T>, meta?: Record<string, unknown>) {
  return okAsync({})
    .andThen(() => {
      return fromPromise(
        inject().Logger(),
        (error) => new ServiceError("Failed to inject Logger instance.", error)
      );
    })
    .andThen((logger) => {
      return fromPromise(
        fn(),
        (error: unknown) => {
          if (error instanceof ValidationError) {
            logger.info("tolerated: ValidationError occurred.", { error, meta });
            return error;
          } else if (error instanceof BadRequestError) {
            logger.info("tolerated: BadRequestError occurred.", { error, meta });
            return error;
          } else if (error instanceof AuthorizationError) {
            logger.info("tolerated: AuthorizationError occurred.", { error, meta });
            return error;
          } else if (error instanceof ForbiddenError) {
            logger.warn("tolerated: ForbiddenError occurred.", { error, meta });
            return error;
          } else if (error instanceof NotFoundError) {
            logger.info("tolerated: NotFoundError occurred.", { error, meta });
            return error;
          } else if (error instanceof ConflictError) {
            logger.info("tolerated: ConflictError occurred.", { error, meta });
            return error;
          } else if (error instanceof ServiceError) {
            logger.error("tolerated: ServiceError occurred.", { error, meta });
            return error;
          }
      
          logger.error("tolerated: Unexpected Error occurred.", { error, meta });
          return new ServiceError("Unexpected Error", error);
        }
      );
    });
}
