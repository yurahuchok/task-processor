import { ConsumerService } from "../../service/ConsumerService";
import { ProcessorServiceFactory } from "./ProcessorServiceFactory";
import { QueueServiceFactory } from "./QueueServiceFactory";

export class ConsumerServiceFactory {
  static injectionToken = "ConsumerServiceFactory" as const;

  static inject = [
    QueueServiceFactory.injectionToken,
    ProcessorServiceFactory.injectionToken,
  ] as const;

  constructor(
    protected queueServiceFactory: QueueServiceFactory,
    protected processorServiceFactory: ProcessorServiceFactory,
  ) {}

  async make() {
    return new ConsumerService(
      await this.queueServiceFactory.make(),
      await this.processorServiceFactory.make(),
    );
  }
}
