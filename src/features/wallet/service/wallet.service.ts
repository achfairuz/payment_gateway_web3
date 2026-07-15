import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaErrorHandler } from '@common/handlers/prisma-error.handler';
import { IWalletRepository, WALLET_REPOSITORY } from '@wallet/interfaces/wallet.interface';
import { WalletEntity } from '@wallet/entity/wallet.entity';
import { CreateWalletDto, UpdateDefaultWalletDto, UpdateWalletDto } from '@wallet/dto/wallet.dto';

const WALLET_CONFLICT_MESSAGE = 'This address is already registered for this merchant';
const WALLET_NOT_FOUND_MESSAGE = 'Wallet not found';

@Injectable()
export class WalletService {
  constructor(
    @Inject(WALLET_REPOSITORY) private readonly walletRepository: IWalletRepository,
  ) {}

  async create(dto: CreateWalletDto, merchantId: string): Promise<WalletEntity> {
    try {
      const wallet = await this.walletRepository.createWallet(dto, merchantId);
      return WalletEntity.fromPrisma(wallet);
    } catch (error) {
      PrismaErrorHandler.handle(error, { conflictMessage: WALLET_CONFLICT_MESSAGE });
    }
  }

  async findById(id: string): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findWalletById(id);
    if (!wallet) {
      throw new NotFoundException(WALLET_NOT_FOUND_MESSAGE);
    }
    return WalletEntity.fromPrisma(wallet);
  }

  async findByMerchantId(merchantId: string): Promise<WalletEntity[]> {
    const wallets = await this.walletRepository.getWalletByMerchantId(merchantId);
    return wallets.map((wallet) => WalletEntity.fromPrisma(wallet));
  }

  async update(id: string, merchantId: string, dto: UpdateWalletDto): Promise<WalletEntity> {
    try {
      const wallet = await this.walletRepository.updateWallet(id, merchantId, dto);
      return WalletEntity.fromPrisma(wallet);
    } catch (error) {
      PrismaErrorHandler.handle(error, {
        conflictMessage: WALLET_CONFLICT_MESSAGE,
        notFoundMessage: WALLET_NOT_FOUND_MESSAGE,
      });
    }
  }

  async delete(id: string, merchantId: string): Promise<WalletEntity> {
    try {
      const wallet = await this.walletRepository.deleteWallet(id, merchantId);
      return WalletEntity.fromPrisma(wallet);
    } catch (error) {
      PrismaErrorHandler.handle(error, { notFoundMessage: WALLET_NOT_FOUND_MESSAGE });
    }
  }

  async setDefault(id: string, merchantId: string, dto: UpdateDefaultWalletDto): Promise<WalletEntity> {
    if (!dto.isDefault) {
      throw new BadRequestException(
        'This endpoint only supports marking a wallet as default; unset it by setting another wallet as default instead',
      );
    }
    try {
      const wallet = await this.walletRepository.setDefaultWallet(id, merchantId);
      return WalletEntity.fromPrisma(wallet);
    } catch (error) {
      PrismaErrorHandler.handle(error, { notFoundMessage: WALLET_NOT_FOUND_MESSAGE });
    }
  }
}
