import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MerchantController } from './controller/merchant.controller';
import { MerchantService } from './service/merchant.service';
import { MerchantRepository } from './repository/merchant.repository';
import { MERCHANT_REPOSITORY } from './interfaces/merchant.interface';
import { MerchantOwnershipGuard } from './guards/merchant-ownership.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MerchantController],
  providers: [
    MerchantService,
    { provide: MERCHANT_REPOSITORY, useClass: MerchantRepository },
    MerchantOwnershipGuard,
  ],
  exports: [MerchantService, MerchantOwnershipGuard],
})
export class MerchantModule {}
