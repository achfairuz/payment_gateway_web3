import { ApiProperty } from '@nestjs/swagger';
import {
  Merchant as PrismaMerchant,
  MerchantStatus,
} from '../../../../generated/prisma/client';

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

/**
 * Response shape for merchant creation only — includes the raw secretKey.
 * This is the one and only time the raw value is ever exposed; afterwards
 * only its bcrypt hash exists, so it can never be shown again.
 */
export class MerchantCreatedEntity extends MerchantEntity {
  @ApiProperty({ description: 'Raw secret key — store it securely, it cannot be retrieved again' })
  secretKey!: string;

  static fromPrismaWithSecret(merchant: PrismaMerchant, rawSecretKey: string): MerchantCreatedEntity {
    const entity = new MerchantCreatedEntity();
    entity.id = merchant.id;
    entity.name = merchant.name;
    entity.status = merchant.status;
    entity.apiKey = merchant.apiKey;
    entity.createdAt = merchant.createdAt;
    entity.updatedAt = merchant.updatedAt;
    entity.secretKey = rawSecretKey;
    return entity;
  }
}
