import { createInjector } from "typed-inject";
import { ConfigFactory } from "./factory/ConfigFactory";
import { ConsumerServiceFactory } from "./factory/ConsumerServiceFactory";
import { DynamoDBClientFactory } from "./factory/DynamoDBClientFactory";
import { LoggerFactory } from "./factory/LoggerFactory";
import { ProcessorServiceFactory } from "./factory/ProcessorServiceFactory";
import { PublisherServiceFactory } from "./factory/PublisherServiceFactory";
import { QueueServiceFactory } from "./factory/QueueServiceFactory";
import { SQSClientFactory } from "./factory/SQSClientFactory";
import { TaskRepositoryFactory } from "./factory/TaskRepositoryFactory";

const injector = createInjector()
  .provideClass(ConfigFactory.injectionToken, ConfigFactory)
  .provideClass(LoggerFactory.injectionToken, LoggerFactory)
  .provideClass(DynamoDBClientFactory.injectionToken, DynamoDBClientFactory)
  .provideClass(SQSClientFactory.injectionToken, SQSClientFactory)
  .provideClass(TaskRepositoryFactory.injectionToken, TaskRepositoryFactory)
  .provideClass(QueueServiceFactory.injectionToken, QueueServiceFactory)
  .provideClass(ProcessorServiceFactory.injectionToken, ProcessorServiceFactory)
  .provideClass(PublisherServiceFactory.injectionToken, PublisherServiceFactory)
  .provideClass(ConsumerServiceFactory.injectionToken, ConsumerServiceFactory);

export function inject() {
  return {
    Config: () => injector.resolve("ConfigFactory").make(),
    Logger: () => injector.resolve("LoggerFactory").make(),
    PublisherService: () => injector.resolve("PublisherServiceFactory").make(),
    ConsumerService: () => injector.resolve("ConsumerServiceFactory").make(),
  };
}
