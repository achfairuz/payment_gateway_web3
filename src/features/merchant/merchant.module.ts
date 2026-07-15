import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MerchantController } from './controller/merchant.controller';
import { MerchantService } from './service/merchant.service';
import { MerchantRepository } from './repository/merchant.repository';
import { MERCHANT_REPOSITORY } from './interfaces/merchant.interface';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MerchantController],
  providers: [
    MerchantService,
    { provide: MERCHANT_REPOSITORY, useClass: MerchantRepository },
  ],
  exports: [MerchantService],
})
export class MerchantModule {}
