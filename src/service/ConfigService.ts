import { Config } from "../type/Config";

export class ConfigService {
  constructor(protected config: Config) {}

  get() {
    return this.config;
  }
}
