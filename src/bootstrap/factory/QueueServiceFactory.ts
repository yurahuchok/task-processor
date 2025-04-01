import { QueueService } from "../../service/QueueService";
import { BaseFactory } from "./BaseFactory";
import { ConfigFactory } from "./ConfigFactory";
import { SQSClientFactory } from "./SQSClientFactory";

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
    return new QueueService(
      await this.sqsClientFactory.make(),
      (await this.configFactory.make()).QUEUE_URL,
    );
  }
}
