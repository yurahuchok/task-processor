import { z } from "zod";

export const Config = z.object({
  QUEUE_URL: z.string(),
  TABLE_NAME: z.string(),
});

export type Config = z.infer<typeof Config>;
