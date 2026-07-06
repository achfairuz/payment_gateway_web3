import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, type Prisma } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  declare user: Prisma.UserDelegate;
  declare refreshToken: Prisma.RefreshTokenDelegate;
  declare merchant: Prisma.MerchantDelegate;
  declare wallet: Prisma.WalletDelegate;
  declare invoice: Prisma.InvoiceDelegate;
  declare transaction: Prisma.TransactionDelegate;
  declare webhookLog: Prisma.WebhookLogDelegate;

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
