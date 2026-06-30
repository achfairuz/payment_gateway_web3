import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MerchantController } from './controller/merchant.controller';
import { MerchantService } from './service/merchant.service';
import { MerchantRepository } from './repository/merchant.repository';

@Module({
  imports: [PrismaModule],
  controllers: [MerchantController],
  providers: [MerchantService, MerchantRepository],
  exports: [MerchantService],
})
export class MerchantModule {}
