import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WalletController } from './controller/wallet.controller';
import { WalletService } from './service/wallet.service';
import { WalletRepository } from './repository/wallet.repository';
import { WALLET_REPOSITORY } from './interfaces/wallet.interface';

@Module({
  imports: [PrismaModule],
  controllers: [WalletController],
  providers: [
    WalletService,
    { provide: WALLET_REPOSITORY, useClass: WalletRepository },
  ],
  exports: [WalletService],
})
export class WalletModule {}
