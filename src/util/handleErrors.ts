import { fromPromise, okAsync } from "neverthrow";
import { inject } from "../bootstrap/inject";
import { AuthorizationError } from "../error/AuthorizationError";
import { BadRequestError } from "../error/BadRequestError";
import { ConflictError } from "../error/ConflictError";
import { ForbiddenError } from "../error/ForbiddenError";
import { NotFoundError } from "../error/NotFoundError";
import { ServiceError } from "../error/ServiceError";
import { ValidationError } from "../error/ValidationError";
import { TaskValidationError } from "../error/TaskValidationError";
import { TaskProcessingError } from "../error/TaskProcessingError";

type Meta = {
  procedure: string;
  [key: string]: unknown;
}

export function handleErrors<T>(fn: () => Promise<T>, meta?: Meta) {
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
            logger.info("handleErrors: ValidationError occurred.", { error, meta });
            return error;
          } else if (error instanceof BadRequestError) {
            logger.info("handleErrors: BadRequestError occurred.", { error, meta });
            return error;
          } else if (error instanceof AuthorizationError) {
            logger.info("handleErrors: AuthorizationError occurred.", { error, meta });
            return error;
          } else if (error instanceof ForbiddenError) {
            logger.warn("handleErrors: ForbiddenError occurred.", { error, meta });
            return error;
          } else if (error instanceof NotFoundError) {
            logger.info("handleErrors: NotFoundError occurred.", { error, meta });
            return error;
          } else if (error instanceof ConflictError) {
            logger.info("handleErrors: ConflictError occurred.", { error, meta });
            return error;
          } else if (error instanceof ServiceError) {
            logger.error("handleErrors: ServiceError occurred.", { error, meta });
            return error;
          } else if (error instanceof TaskValidationError) {
            logger.info("handleErrors: TaskValidationError occurred.", { error, meta });
            return error;
          } else if (error instanceof TaskProcessingError) {
            logger.warn("handleErrors: TaskProcessingError occurred.", { error, meta });
            return error;
          }
      
          logger.error("handleErrors: Unexpected Error occurred.", { error, meta });
          return new ServiceError("Unexpected Error", error);
        }
      );
    });
}
