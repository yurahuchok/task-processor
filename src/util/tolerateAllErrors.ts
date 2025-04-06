import { fromPromise } from "neverthrow";
import { AuthorizationError } from "../error/AuthorizationError";
import { BadRequestError } from "../error/BadRequestError";
import { ConflictError } from "../error/ConflictError";
import { ForbiddenError } from "../error/ForbiddenError";
import { NotFoundError } from "../error/NotFoundError";
import { ServiceError } from "../error/ServiceError";
import { TaskDuplicateError } from "../error/TaskDuplicateError";
import { TaskParsingError } from "../error/TaskParsingError";
import { TaskProcessingError } from "../error/TaskProcessingError";
import { UnknownError } from "../error/UnknownError";
import { ValidationError } from "../error/ValidationError";
import { injectLoggerOrThrow } from "./injectLoggerOrThrow";

export async function tolerateAllErrors<T>(meta: { procedure: string; [key: string]: unknown }, fn: () => Promise<T>) {
  const logger = await injectLoggerOrThrow();
  return fromPromise(fn(), (error: unknown) => {
    switch (true) {
      case error instanceof ValidationError:
      case error instanceof BadRequestError:
      case error instanceof AuthorizationError:
      case error instanceof NotFoundError:
      case error instanceof ConflictError:
        logger.info("tolerateAllErrors: Error occurred.", { error, meta });
        return error;
      case error instanceof ForbiddenError:
      case error instanceof TaskParsingError:
      case error instanceof TaskDuplicateError:
      case error instanceof TaskProcessingError:
        logger.warn("tolerateAllErrors: Error occurred.", { error, meta });
        return error;
      case error instanceof ServiceError:
        logger.error("tolerateAllErrors: Error occurred.", { error, meta });
        return error;
      default:
        logger.error("tolerateAllErrors: Unexpected Error occurred.", { error, meta });
        return new UnknownError("Unexpected Error occurred.", error);
    }
  });
}
