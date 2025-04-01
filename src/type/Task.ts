import { z } from "zod";

export const Task = z.object({
  id: z.string().min(1),
  payload: z.object({
    simulation: z
      .object({
        executionTime: z.number().min(0).max(1000),
        failureChance: z.number().min(0).max(1),
      })
      .partial()
      .optional(),
  }),
});

export type Task = z.infer<typeof Task>;
