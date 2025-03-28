import { z } from "zod";

export const PublishRequest = z.object({
  body: z.string().transform((x) => JSON.parse(x)).pipe(
    z.object({
      id: z.string().min(1),
      payload: z.record(z.string(), z.any()),
    }),
  ),
});

export type PublishRequest = z.infer<typeof PublishRequest>;
