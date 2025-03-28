import { z } from "zod";

const config = z.object({
  QUEUE_URL: z.string(),
});

export function getConfig() {
  return config.parse(process.env);
}
