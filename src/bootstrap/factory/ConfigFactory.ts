import { Config } from "../../type/Config";

export class ConfigFactory {
  static injectionToken = "ConfigFactory" as const;

  make(): Config {
    return Config.parse(process.env);
  }
}
