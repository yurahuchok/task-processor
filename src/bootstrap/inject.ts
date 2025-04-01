import { createInjector } from 'typed-inject';
import { DynamoDBClientFactory } from './factory/DynamoDBClientFactory';
import { TaskRepositoryFactory } from './factory/TaskRepositoryFactory';
import { ProcessorServiceFactory } from './factory/ProcessorServiceFactory';
import { ConfigFactory } from './factory/ConfigFactory';
import { LoggerFactory } from './factory/LoggerFactory';
import { QueueServiceFactory } from './factory/QueueServiceFactory';
import { SQSClientFactory } from './factory/SQSClientFactory';
import { ConsumerServiceFactory } from './factory/ConsumerServiceFactory';
import { PublisherServiceFactory } from './factory/PublisherServiceFactory';
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
  }
}
