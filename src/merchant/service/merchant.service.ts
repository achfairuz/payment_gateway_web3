import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponseHelper } from '@common/helpers/response.helper';
import { Prisma } from '../../../generated/prisma/client';
import {
  IMerchantRepository,
  MERCHANT_REPOSITORY,
} from '@merchant/interfaces/merchant.interface';
import { MerchantEntity } from '@merchant/entity/merchant.entity';

@Injectable()
export class MerchantService {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepository: IMerchantRepository,
  ) {}

  async create(
    name: string,
    userId: string,
    apiKey: string,
    secretKey: string,
  ): Promise<MerchantEntity> {
    try {
      const merchant = await this.merchantRepository.createMerchant(
        name,
        userId,
        apiKey,
        secretKey,
      );
      return MerchantEntity.fromPrisma(merchant);
    } catch (error) {
      this.handleError(error, 'API key is already in use');
    }
  }

  async findById(id: string): Promise<MerchantEntity> {
    try {
      const merchant = await this.merchantRepository.findById(id);
      if (!merchant) {
        throw new NotFoundException('Merchant not found');
      }
      return MerchantEntity.fromPrisma(merchant);
    } catch (error) {
      this.handleError(error, 'Failed to retrieve merchant');
    }
  }

  async update(
    id: string,
    userId: string,
    name: string,
    apiKey: string,
    secretKey: string,
  ): Promise<MerchantEntity> {
    try {
      const merchant = await this.merchantRepository.updateMerchant(
        id,
        userId,
        name,
        apiKey,
        secretKey,
      );
      return MerchantEntity.fromPrisma(merchant);
    } catch (error) {
      this.handleError(
        error,
        'API key is already in use',
        'Merchant not found',
      );
    }
  }

  async delete(id: string, userId: string): Promise<MerchantEntity> {
    try {
      const merchant = await this.merchantRepository.deleteMerchant(id, userId);
      return MerchantEntity.fromPrisma(merchant);
    } catch (error) {
      this.handleError(error, undefined, 'Merchant not found');
    }
  }

  private handleError(
    error: unknown,
    conflictMessage?: string,
    notFoundMessage?: string,
  ): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && conflictMessage) {
        throw new ConflictException(conflictMessage);
      }
      if (error.code === 'P2025' && notFoundMessage) {
        throw new NotFoundException(notFoundMessage);
      }
    }

    ResponseHelper.throwHttpError(error);
  }
}
