import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repository/wallet.repository';
import { createWalletDto } from '@wallet/dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) { }

  async create(payload: createWalletDto, merchantId: string) {
    return await this.walletRepository.createWallet(payload, merchantId);
  }

  async findById(id: string) {
    return await this.walletRepository.findWalletById(id);
  }
}
