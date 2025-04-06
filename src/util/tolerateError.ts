import { fromPromise } from "neverthrow";
import { UnknownError } from "../error/UnknownError";
import { injectLoggerOrThrow } from "./injectLoggerOrThrow";

export async function tolerateError<T>(meta: { procedure: string; [key: string]: unknown }, fn: () => Promise<T>) {
  const logger = await injectLoggerOrThrow();
  return fromPromise(fn(), (error: unknown) => {
    logger.warn("tolerateError: Error occurred.", { error, meta });
    return new UnknownError("Error occurred.", error);
  });
}
