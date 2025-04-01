import { okAsync } from "neverthrow";
import { typeError } from "./typeError";
import { logError, Meta } from "./logError";
import { inject } from "../bootstrap/inject";
import { fromPromise } from "neverthrow";
import { ServiceError } from "../error/ServiceError";

export function handleError<T>(meta: Meta, fn: () => Promise<T>) {
  return okAsync({})
    .andThen(() => {  
      return fromPromise(
        inject().Logger(),
        (error: unknown) => new ServiceError("Failed to inject Logger instance for error handling.", error)
      );
    })
    .andThen((logger) => {
      return fromPromise(
        fn(),
        (error: unknown) => {
          logError(error, logger, meta);
          return typeError(error);
        }
      )
    });
}
