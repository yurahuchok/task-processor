import { Config } from "../../type/Config";
import { BaseFactory } from "./BaseFactory";

export class ConfigFactory extends BaseFactory<Config> {
  static injectionToken = "ConfigFactory" as const;

  protected async _make() {
    return Config.parse(process.env);
  }
}
