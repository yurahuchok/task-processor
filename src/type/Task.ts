import { z } from "zod";

export const Task = z.object({
  id: z.string().min(1),
  payload: z.record(z.string(), z.any()),
});

export type Task = z.infer<typeof Task>;
