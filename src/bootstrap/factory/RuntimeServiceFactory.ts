import { RuntimeService } from "../../service/RuntimeService";
import { BaseFactory } from "./BaseFactory";
import { LoggerFactory } from "./LoggerFactory";

export class RuntimeServiceFactory extends BaseFactory<RuntimeService> {
  static injectionToken = "RuntimeServiceFactory" as const;
  
  static inject = [
    LoggerFactory.injectionToken,
  ] as const;
  
  constructor(protected loggerFactory: LoggerFactory) {
    super();
  }

  protected async _make() {
    return new RuntimeService(
      await this.loggerFactory.make(),
    );
  }
}
