import { AuthorizationError } from "../error/AuthorizationError";
import { BadRequestError } from "../error/BadRequestError";
import { ConflictError } from "../error/ConflictError";
import { ForbiddenError } from "../error/ForbiddenError";
import { NotFoundError } from "../error/NotFoundError";
import { ServiceError } from "../error/ServiceError";
import { TaskDuplicateError } from "../error/TaskDuplicateError";
import { TaskParsingError } from "../error/TaskParsingError";
import { TaskProcessingError } from "../error/TaskProcessingError";
import { ValidationError } from "../error/ValidationError";
import { UnknownError } from "../error/UnknownError";
import { injectLoggerOrThrow } from "./injectLoggerOrThrow";

export type Meta =
  | string
  | {
      procedure: string;
      [key: string]: unknown;
    };

export async function logError(meta: Meta, error: unknown) {
  const logger = await injectLoggerOrThrow();

  switch (true) {
    case error instanceof ValidationError:
      logger.info("error: ValidationError occurred.", { error, meta });
      return error;
    case error instanceof BadRequestError:
      logger.info("error: BadRequestError occurred.", { error, meta });
      return error;
    case error instanceof AuthorizationError:
      logger.info("error: AuthorizationError occurred.", { error, meta });
      return error;
    case error instanceof ForbiddenError:
      logger.warn("error: ForbiddenError occurred.", { error, meta });
      return error;
    case error instanceof NotFoundError:
      logger.info("error: NotFoundError occurred.", { error, meta });
      return error;
    case error instanceof ConflictError:
      logger.info("error: ConflictError occurred.", { error, meta });
      return error;
    case error instanceof ServiceError:
      logger.error("error: ServiceError occurred.", { error, meta });
      return error;
    case error instanceof TaskParsingError:
      logger.warn("error: TaskParsingError occurred.", { error, meta });
      return error;
    case error instanceof TaskDuplicateError:
      logger.warn("error: TaskDuplicateError occurred.", { error, meta });
      return error;
    case error instanceof TaskProcessingError:
      logger.warn("error: TaskProcessingError occurred.", { error, meta });
      return error;
    default:
      logger.error("error: Unexpected Error occurred.", { error, meta });
      return new UnknownError("Unexpected Error occurred.", error);
  }
}
