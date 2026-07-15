import { ApiProperty } from '@nestjs/swagger';
import {
  Merchant as PrismaMerchant,
  MerchantStatus,
} from '../../../generated/prisma/client';

/**
 * Safe, outward-facing shape of a Merchant.
 * secretKey is intentionally never included here — it must not leave the
 * service layer once it has been generated/hashed.
 */
export class MerchantEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: MerchantStatus })
  status!: MerchantStatus;

  @ApiProperty({ description: 'Public API key for merchant integration' })
  apiKey!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromPrisma(merchant: PrismaMerchant): MerchantEntity {
    const entity = new MerchantEntity();
    entity.id = merchant.id;
    entity.name = merchant.name;
    entity.status = merchant.status;
    entity.apiKey = merchant.apiKey;
    entity.createdAt = merchant.createdAt;
    entity.updatedAt = merchant.updatedAt;
    return entity;
  }
}
