import { ApiProperty } from '@nestjs/swagger';
import { Wallet as PrismaWallet } from 'generated/prisma/client';

export class WalletEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  merchantId!: string;

  @ApiProperty()
  address!: string;

  @ApiProperty()
  network!: string;

  @ApiProperty()
  isDefault!: boolean;

  @ApiProperty()
  createdAt!: Date;

  static fromPrisma(wallet: PrismaWallet): WalletEntity {
    const entity = new WalletEntity();
    entity.id = wallet.id;
    entity.merchantId = wallet.merchantId;
    entity.address = wallet.address;
    entity.network = wallet.network;
    entity.isDefault = wallet.isDefault;
    entity.createdAt = wallet.createdAt;
    return entity;
  }
}
