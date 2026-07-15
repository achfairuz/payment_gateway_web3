import { Merchant as PrismaMerchant } from '../../../../generated/prisma/client';

export const MERCHANT_REPOSITORY = Symbol('MERCHANT_REPOSITORY');

export interface IMerchantRepository {
  findById(id: string): Promise<PrismaMerchant | null>;
  findByIdAndUserId(id: string, userId: string): Promise<PrismaMerchant | null>;
  createMerchant(
    name: string,
    userId: string,
    apiKey: string,
    secretKey: string,
  ): Promise<PrismaMerchant>;
  updateMerchant(id: string, userId: string, name?: string): Promise<PrismaMerchant>;
  deleteMerchant(id: string, userId: string): Promise<PrismaMerchant>;
}
