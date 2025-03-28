import { z } from "zod";

export const SubmitRequest = z.object({
  body: z.object({
    id: z.string().min(1),
    payload: z.object({}),
  }),
});

export type SubmitRequest = z.infer<typeof SubmitRequest>;
