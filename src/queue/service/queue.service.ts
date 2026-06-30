import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../repository/queue.repository';

@Injectable()
export class QueueService {
  constructor(private readonly queueRepository: QueueRepository) {}
}
