import { serializeError } from "serialize-error";
import type { Logger } from "winston";
import * as winston from "winston";
import { BaseFactory } from "./BaseFactory";
import { ConfigFactory } from "./ConfigFactory";

export class LoggerFactory extends BaseFactory<Logger> {
  static injectionToken = "LoggerFactory" as const;

  static inject = [ConfigFactory.injectionToken] as const;

  constructor(protected configFactory: ConfigFactory) {
    super();
  }

  protected async _make() {
    const config = await this.configFactory.make();

    return winston.createLogger({
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format((info) => {
          if (info.metadata !== undefined) {
            info.metadata = serializeError(info.metadata, { maxDepth: 10 });
          }
          return info;
        })(),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
      defaultMeta: { application: `task-processor-${config.NODE_ENV}` },
      level: config.NODE_ENV === "dev" ? "debug" : "info",
    });
  }
}
