import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BlockchainController } from './controller/blockchain.controller';
import { BlockchainService } from './service/blockchain.service';
import { BlockchainRepository } from './repository/blockchain.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BlockchainController],
  providers: [BlockchainService, BlockchainRepository],
  exports: [BlockchainService],
})
export class BlockchainModule {}
