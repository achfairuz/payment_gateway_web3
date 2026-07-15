import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateWalletPayload,
  IWalletRepository,
  UpdateWalletPayload,
} from '@wallet/interfaces/wallet.interface';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWallet(payload: CreateWalletPayload, merchantId: string) {
    return this.prisma.wallet.create({
      data: {
        merchantId,
        ...payload,
      },
    });
  }

  async findWalletById(id: string) {
    return this.prisma.wallet.findUnique({
      where: { id },
    });
  }

  async getAllWallets() {
    return this.prisma.wallet.findMany();
  }

  async getWalletByMerchantId(merchantId: string) {
    return this.prisma.wallet.findMany({
      where: { merchantId },
    });
  }

  async updateWallet(id: string, merchantId: string, payload: UpdateWalletPayload) {
    return this.prisma.wallet.update({
      where: { id, merchantId },
      data: payload,
    });
  }

  async deleteWallet(id: string, merchantId: string) {
    return this.prisma.wallet.delete({
      where: { id, merchantId },
    });
  }

  async deleteByMerchantId(merchantId: string) {
    return this.prisma.wallet.deleteMany({
      where: { merchantId },
    });
  }

  async setDefaultWallet(id: string, merchantId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.wallet.updateMany({
        where: { merchantId, isDefault: true },
        data: { isDefault: false },
      });
      return tx.wallet.update({
        where: { id, merchantId },
        data: { isDefault: true },
      });
    });
  }
}
