import { PublisherService } from "../../service/PublisherService";
import { QueueServiceFactory } from "./QueueServiceFactory";

export class PublisherServiceFactory {
  static injectionToken = "PublisherServiceFactory" as const;

  static inject = [
    QueueServiceFactory.injectionToken,
  ] as const;

  constructor(
    protected queueServiceFactory: QueueServiceFactory,
  ) {}

  async make() {
    return new PublisherService(
      await this.queueServiceFactory.make(),
    );
  }
}
