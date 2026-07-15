import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WalletRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createWallet(payload: any, merchantId: string) {
    return await this.prisma.wallet.create({
      data: {
        merchantId,
        ...payload,
      },
    });
  }

  async findWalletById(id: string) {
    return await this.prisma.wallet.findUnique({
      where: { id },
    });
  }

  async getAllWallets() {
    return await this.prisma.wallet.findMany();
  }

  async getWalletByMerchantId(merchantId: string) {
    return await this.prisma.wallet.findMany({
      where: { merchantId },
    });
  }

  async updateWallet(id: string, payload: any) {
    return await this.prisma.wallet.update({
      where: { id },
      data: payload,
    });
  }

  async deleteWallet(id: string) {
    return await this.prisma.wallet.delete({
      where: { id },
    });
  }

  async deleteByMerchantId(merchantId: string) {
    return await this.prisma.wallet.deleteMany({
      where: { merchantId },
    });
  }
}
