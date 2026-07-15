import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WebhookController } from './controller/webhook.controller';
import { WebhookService } from './service/webhook.service';
import { WebhookRepository } from './repository/webhook.repository';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookRepository],
  exports: [WebhookService],
})
export class WebhookModule {}
