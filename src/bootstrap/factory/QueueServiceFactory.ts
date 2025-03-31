import { QueueService } from "../../service/QueueService";
import { BaseFactory } from "./BaseFactory";
import { SQSClientFactory } from "./SQSClientFactory";
import { ConfigFactory } from "./ConfigFactory";

export class QueueServiceFactory extends BaseFactory<QueueService> {
  static injectionToken = "QueueServiceFactory" as const;
  
  static inject = [
    SQSClientFactory.injectionToken,
    ConfigFactory.injectionToken,
  ] as const;

  constructor(
    protected sqsClientFactory: SQSClientFactory,
    protected configFactory: ConfigFactory,
  ) {
    super();
  }

  protected async _make() {
    return new QueueService(await this.sqsClientFactory.make(), (await this.configFactory.make()).QUEUE_URL);
  }
}
