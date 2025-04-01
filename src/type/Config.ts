import { z } from "zod";

export const Config = z.object({
  NODE_ENV: z.enum(["dev"]),
  QUEUE_URL: z.string(),
  TABLE_NAME: z.string(),
});

export type Config = z.infer<typeof Config>;
