import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IWalletRepository, WALLET_REPOSITORY } from '@wallet/interfaces/wallet.interface';
import { WalletEntity } from '@wallet/entity/wallet.entity';
import { createWalletDto } from '@wallet/dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @Inject(WALLET_REPOSITORY) private readonly walletRepository: IWalletRepository,
  ) { }

  async create(payload: createWalletDto, merchantId: string) {
    try {
      return await this.walletRepository.createWallet(payload, merchantId);
    } catch (error) {
      throw new Error('Failed to create wallet');
    }
  }

  async findById(id: string): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findWalletById(id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return WalletEntity.fromPrisma(wallet);
  }

  async getAllWallets(): Promise<WalletEntity[]> {
    const wallets = await this.walletRepository.getAllWallets();
    return wallets.map(wallet => WalletEntity.fromPrisma(wallet));
  }
}
