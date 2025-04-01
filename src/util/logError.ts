import type { Logger } from "winston";
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

export type Meta =
  | string
  | {
      procedure: string;
      [key: string]: unknown;
    };

export function logError(error: unknown, logger: Logger, meta?: Meta) {
  switch (true) {
    case error instanceof ValidationError:
      logger.info("error: ValidationError occurred.", { error, meta });
      break;
    case error instanceof BadRequestError:
      logger.info("error: BadRequestError occurred.", { error, meta });
      break;
    case error instanceof AuthorizationError:
      logger.info("error: AuthorizationError occurred.", { error, meta });
      break;
    case error instanceof ForbiddenError:
      logger.warn("error: ForbiddenError occurred.", { error, meta });
      break;
    case error instanceof NotFoundError:
      logger.info("error: NotFoundError occurred.", { error, meta });
      break;
    case error instanceof ConflictError:
      logger.info("error: ConflictError occurred.", { error, meta });
      break;
    case error instanceof ServiceError:
      logger.error("error: ServiceError occurred.", { error, meta });
      break;
    case error instanceof TaskParsingError:
      logger.warn("error: TaskParsingError occurred.", { error, meta });
      break;
    case error instanceof TaskDuplicateError:
      logger.warn("error: TaskDuplicateError occurred.", { error, meta });
      break;
    case error instanceof TaskProcessingError:
      logger.warn("error: TaskProcessingError occurred.", { error, meta });
      break;
    default:
      logger.error("error: Unexpected Error occurred.", { error, meta });
  }
}
