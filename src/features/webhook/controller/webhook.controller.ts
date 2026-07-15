import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhookService } from '../service/webhook.service';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
}
