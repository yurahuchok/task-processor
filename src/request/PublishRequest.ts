import { z } from "zod";
import { Task } from "../type/Task";

export const PublishRequest = z.object({
  body: z.string().transform((x) => JSON.parse(x)).pipe(Task),
});

export type PublishRequest = z.infer<typeof PublishRequest>;
