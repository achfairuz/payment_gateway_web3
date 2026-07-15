import { Injectable } from '@nestjs/common';
import { WebhookRepository } from '../repository/webhook.repository';

@Injectable()
export class WebhookService {
  constructor(private readonly webhookRepository: WebhookRepository) {}
}
