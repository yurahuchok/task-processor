import { ConfigService } from "../../service/ConfigService";
import { Config } from "../../type/Config";

export class ConfigServiceFactory {
  static injectionToken = "ConfigServiceFactory";

  make(): ConfigService {
    return new ConfigService(Config.parse(process.env));
  }
}
