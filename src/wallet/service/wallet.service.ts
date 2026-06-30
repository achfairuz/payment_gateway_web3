import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repository/wallet.repository';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}
}
