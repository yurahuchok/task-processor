import { ConfigService } from "../../service/ConfigService";
import { Config } from "../../type/Config";

export class ConfigServiceFactory {
  static injectionToken = "ConfigServiceFactory" as const;

  make(): ConfigService {
    return new ConfigService(Config.parse(process.env));
  }
}
