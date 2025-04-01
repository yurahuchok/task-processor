import { okAsync } from "neverthrow";
import { fromPromise } from "neverthrow";
import { inject } from "../bootstrap/inject";
import { ServiceError } from "../error/ServiceError";
import { type Meta, logError } from "./logError";
import { typeError } from "./typeError";

export function handleError<T>(meta: Meta, fn: () => Promise<T>) {
  return okAsync({})
    .andThen(() => {
      return fromPromise(
        inject().Logger(),
        (error: unknown) =>
          new ServiceError(
            "Failed to inject Logger instance for error handling.",
            error,
          ),
      );
    })
    .andThen((logger) => {
      return fromPromise(fn(), (error: unknown) => {
        logError(error, logger, meta);
        return typeError(error);
      });
    });
}
