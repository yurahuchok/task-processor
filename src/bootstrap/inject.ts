import { createInjector } from 'typed-inject';
import { DynamoDBClientFactory } from './factory/DynamoDBClientFactory';
import { TaskRepositoryFactory } from './factory/TaskRepositoryFactory';
import { ProcessorServiceFactory } from './factory/ProcessorServiceFactory';
import { ConfigFactory } from './factory/ConfigFactory';
import { LoggerFactory } from './factory/LoggerFactory';
import { RuntimeServiceFactory } from './factory/RuntimeServiceFactory';
import { QueueServiceFactory } from './factory/QueueServiceFactory';
import { SQSClientFactory } from './factory/SQSClientFactory';

const injector = createInjector()
  .provideClass(ConfigFactory.injectionToken, ConfigFactory)
  .provideClass(LoggerFactory.injectionToken, LoggerFactory)
  .provideClass(DynamoDBClientFactory.injectionToken, DynamoDBClientFactory)
  .provideClass(SQSClientFactory.injectionToken, SQSClientFactory)
  .provideClass(TaskRepositoryFactory.injectionToken, TaskRepositoryFactory)
  .provideClass(RuntimeServiceFactory.injectionToken, RuntimeServiceFactory)
  .provideClass(QueueServiceFactory.injectionToken, QueueServiceFactory)
  .provideClass(ProcessorServiceFactory.injectionToken, ProcessorServiceFactory)

export function inject() {
  return {
    Config: () => injector.resolve("ConfigFactory").make(),
    Logger: () => injector.resolve("LoggerFactory").make(),
    RuntimeService: () => injector.resolve("RuntimeServiceFactory").make(),
    ProcessorService: () => injector.resolve("ProcessorServiceFactory").make(),
    QueueService: () => injector.resolve("QueueServiceFactory").make(),
  }
}

