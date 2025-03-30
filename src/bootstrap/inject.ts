import { createInjector } from 'typed-inject';
import { DynamoDBClientFactory } from './factory/DynamoDBClientFactory';
import { TaskRepositoryFactory } from './factory/TaskRepositoryFactory';
import { ProcessorServiceFactory } from './factory/TaskServiceFactory';
import { ConfigFactory } from './factory/ConfigFactory';

const injector = createInjector()
  .provideClass(ConfigFactory.injectionToken, ConfigFactory)
  .provideClass(DynamoDBClientFactory.injectionToken, DynamoDBClientFactory)
  .provideClass(TaskRepositoryFactory.injectionToken, TaskRepositoryFactory)
  .provideClass(ProcessorServiceFactory.injectionToken, ProcessorServiceFactory);

export function inject() {
  return {
    processorService: () => injector.resolve("ProcessorServiceFactory").make(),
  }
}
