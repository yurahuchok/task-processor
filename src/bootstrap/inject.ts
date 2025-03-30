import { createInjector } from 'typed-inject';
import { DynamoDBClientFactory } from './factory/DynamoDBClientFactory';
import { TaskRepositoryFactory } from './factory/TaskRepositoryFactory';
import { TaskServiceFactory } from './factory/TaskServiceFactory';
import { ConfigServiceFactory } from './factory/ConfigServiceFactory';

const injector = createInjector()
  .provideClass(ConfigServiceFactory.injectionToken, ConfigServiceFactory)
  .provideClass(DynamoDBClientFactory.injectionToken, DynamoDBClientFactory)
  .provideClass(TaskRepositoryFactory.injectionToken, TaskRepositoryFactory)
  .provideClass(TaskServiceFactory.injectionToken, TaskServiceFactory);

export function inject() {
  return {
    taskService: () => injector.resolve("TaskServiceFactory").make(),
  }
}
