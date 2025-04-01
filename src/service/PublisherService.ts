import { Task } from "../type/Task";
import { QueueService } from "./QueueService";

export class PublisherService {
  constructor(protected queueService: QueueService) {}

  async publishTask(task: Task) {
    return this.queueService.publishTask(task);
  }
}
