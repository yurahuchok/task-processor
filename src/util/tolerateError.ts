import { fromPromise } from "neverthrow";
import { UnknownError } from "../error/UnknownError";
import { injectLoggerOrThrow } from "./injectLoggerOrThrow";

export function tolerateError<T>(
  meta: { procedure: string; [key: string]: unknown },
  fn: () => Promise<T>,
) {
  return fromPromise(fn(), async (error: unknown) => {
    (await injectLoggerOrThrow()).warn("tolerateError: Error occurred.", {
      error,
      meta,
    });
    return new UnknownError("Error occurred.", error);
  }).mapErr((error) => error);
}
