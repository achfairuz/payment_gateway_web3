import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QueueController } from './controller/queue.controller';
import { QueueService } from './service/queue.service';
import { QueueRepository } from './repository/queue.repository';

@Module({
  imports: [PrismaModule],
  controllers: [QueueController],
  providers: [QueueService, QueueRepository],
  exports: [QueueService],
})
export class QueueModule {}
