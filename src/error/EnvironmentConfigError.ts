import { ZodError } from "zod";

export class EnvironmentConfigError extends Error {
  readonly _type: "EnvironmentConfigError" = "EnvironmentConfigError";

  constructor(protected internal: ZodError) {
    super("EnvironmentConfigError");
  }
}
