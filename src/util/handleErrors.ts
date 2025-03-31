import { fromPromise, okAsync } from "neverthrow";
import { inject } from "../bootstrap/inject";
import { AuthorizationError } from "../error/AuthorizationError";
import { BadRequestError } from "../error/BadRequestError";
import { ConflictError } from "../error/ConflictError";
import { ForbiddenError } from "../error/ForbiddenError";
import { NotFoundError } from "../error/NotFoundError";
import { ServiceError } from "../error/ServiceError";
import { ValidationError } from "../error/ValidationError";
import { TaskParsingError } from "../error/TaskParsingError";
import { TaskDuplicateError } from "../error/TaskDuplicateError";
import { TaskProcessingError } from "../error/TaskProcessingError";

type ProcedureDescription = string | {
  procedure: string;
  [key: string]: unknown;
}

export async function handleErrors<T>(
  procedure: ProcedureDescription,
  fn: () => Promise<T>,
  options: {
    forceThrow?: boolean;
  } = {},
) {
  options.forceThrow ??= false;

  const result = await okAsync({})
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
            logger.info("handleErrors: ValidationError occurred.", { error, procedure });
            return error;
          } else if (error instanceof BadRequestError) {
            logger.info("handleErrors: BadRequestError occurred.", { error, procedure });
            return error;
          } else if (error instanceof AuthorizationError) {
            logger.info("handleErrors: AuthorizationError occurred.", { error, procedure });
            return error;
          } else if (error instanceof ForbiddenError) {
            logger.warn("handleErrors: ForbiddenError occurred.", { error, procedure });
            return error;
          } else if (error instanceof NotFoundError) {
            logger.info("handleErrors: NotFoundError occurred.", { error, procedure });
            return error;
          } else if (error instanceof ConflictError) {
            logger.info("handleErrors: ConflictError occurred.", { error, procedure });
            return error;
          } else if (error instanceof ServiceError) {
            logger.error("handleErrors: ServiceError occurred.", { error, procedure });
            return error;
          } else if (error instanceof TaskParsingError) {
            logger.warn("handleErrors: TaskParsingError occurred.", { error, procedure });
            return error;
          } else if (error instanceof TaskDuplicateError) {
            logger.warn("handleErrors: TaskDuplicateError occurred.", { error, procedure });
            return error;
          } else if (error instanceof TaskProcessingError) {
            logger.warn("handleErrors: TaskProcessingError occurred.", { error, procedure });
            return error;
          }
      
          logger.error("handleErrors: Unexpected Error occurred.", { error, procedure });
          return new ServiceError("Unexpected Error", error);
        }
      );
    });

  if (result.isErr() && options.forceThrow) {
    throw result.error;
  }

  return result;
}
