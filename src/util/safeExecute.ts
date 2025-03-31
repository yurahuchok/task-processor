import { fromPromise } from "neverthrow";
import { AuthorizationError } from "../error/AuthorizationError";
import { BadRequestError } from "../error/BadRequestError";
import { ConflictError } from "../error/ConflictError";
import { ForbiddenError } from "../error/ForbiddenError";
import { NotFoundError } from "../error/NotFoundError";
import { ServiceError } from "../error/ServiceError";
import { ValidationError } from "../error/ValidationError";

const errors = [
  ValidationError,
  BadRequestError,
  AuthorizationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServiceError,
];

export function safeExecute<T>(fn: () => Promise<T>) {
  return fromPromise(fn(), (error: unknown) => {
    for (const type of errors) {
      if (error instanceof type) {
        return error;
      }
    }

    return new ServiceError("Unexpected Error", error);
  });
}
