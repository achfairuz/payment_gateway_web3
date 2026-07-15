import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { HealthController } from './controller/health.controller';
import { HealthService } from './service/health.service';
import { HealthRepository } from './repository/health.repository';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [HealthService, HealthRepository],
  exports: [HealthService],
})
export class HealthModule {}
