import { z } from "zod";
import { err, ok, type Result } from "neverthrow";
import { EnvironmentConfigError } from "../error/EnvironmentConfigError";
const config = z.object({
  QUEUE_URL: z.string(),
  TABLE_NAME: z.string(),
});

export function getConfig() {
  const result = config.safeParse(process.env);

  if (!result.success) {
    return err(new EnvironmentConfigError(result.error));
  }

  return ok(result.data);
}
