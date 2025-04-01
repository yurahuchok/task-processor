import type { Task } from "../type/Task";
import type { QueueService } from "./QueueService";

export class PublisherService {
  constructor(protected queueService: QueueService) {}

  async publishTask(task: Task) {
    return this.queueService.publishTask(task);
  }
}
