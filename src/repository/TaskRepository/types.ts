import { z } from "zod";
import { Task } from "../../type/Task";

const CompositeId = z.preprocess((val) => {
  if (typeof val !== "string") {
    return undefined;
  }
  return val.match(/TASK#([^.#]+)/)?.[1];
}, Task.shape.id);

const CompositeStatus = z.preprocess((val) => {
  if (typeof val !== "string") {
    return undefined;
  }
  return val.match(/STATUS#([^.#]+)/)?.[1];
}, z.string());

const CompositeFailureCount = z.preprocess((val) => {
  if (typeof val !== "string") {
    return undefined;
  }
  return val.match(/STATUS#([^.#]+)/)?.[1];
}, z.coerce.number().min(1));

export const LockRecord = z.object({
  id: CompositeId,
  status: CompositeStatus.pipe(z.literal("LOCKED")),
  ts: z.string(),
});
export type LockRecord = z.infer<typeof LockRecord>;

export const SuccessRecord = Task.extend({
  id: CompositeId,
  status: CompositeStatus.pipe(z.literal("SUCCESS")),
  ts: z.string(),
});
export type SuccessRecord = z.infer<typeof SuccessRecord>;

export const FailureRecord = Task.extend({
  id: CompositeId,
  status: CompositeStatus.pipe(z.literal("FAILURE")),
  ts: z.string(),
  failureCount: CompositeFailureCount,
  error: z.object({}).passthrough(),
});
export type FailureRecord = z.infer<typeof FailureRecord>;
