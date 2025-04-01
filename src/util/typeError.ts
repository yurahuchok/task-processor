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

const SupportedErrors = [
  ValidationError,
  BadRequestError,
  AuthorizationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServiceError,
  TaskParsingError,
  TaskDuplicateError,
  TaskProcessingError,
] as const;

export function typeError(error: unknown) {
  for (const supportedError of SupportedErrors) {
    if (error instanceof supportedError) {
      return error;
    }
  }

  return new UnknownError("Unknown Error occurred.", error);
}
