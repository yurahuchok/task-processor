import { fromPromise, okAsync } from "neverthrow";
import { type Meta, logError } from "./logError";

export function handleError<T>(meta: Meta, fn: () => Promise<T>) {
  return fromPromise(
    fn(),
    (error: unknown) => logError(meta, error)
  ).mapErr((error) => error);
}
