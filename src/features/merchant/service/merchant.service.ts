import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaErrorHandler } from '@common/handlers/prisma-error.handler';
import { ApiCredentialsHelper } from '@common/helpers/api-credentials.helper';
import {
  IMerchantRepository,
  MERCHANT_REPOSITORY,
} from '@merchant/interfaces/merchant.interface';
import { MerchantCreatedEntity, MerchantEntity } from '@merchant/entity/merchant.entity';
import { CreateMerchantDto } from '@merchant/dto/merchant.dto';

@Injectable()
export class MerchantService {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepository: IMerchantRepository,
  ) {}

  async create(dto: CreateMerchantDto, userId: string): Promise<MerchantCreatedEntity> {
    const { apiKey, rawSecretKey, hashedSecretKey } = await ApiCredentialsHelper.generate();
    try {
      const merchant = await this.merchantRepository.createMerchant(
        dto.name,
        userId,
        apiKey,
        hashedSecretKey,
      );
      return MerchantCreatedEntity.fromPrismaWithSecret(merchant, rawSecretKey);
    } catch (error) {
      PrismaErrorHandler.handle(error, { conflictMessage: 'API key is already in use' });
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
      PrismaErrorHandler.handle(error);
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
      PrismaErrorHandler.handle(error, {
        conflictMessage: 'API key is already in use',
        notFoundMessage: 'Merchant not found',
      });
    }
  }

  async delete(id: string, userId: string): Promise<MerchantEntity> {
    try {
      const merchant = await this.merchantRepository.deleteMerchant(id, userId);
      return MerchantEntity.fromPrisma(merchant);
    } catch (error) {
      PrismaErrorHandler.handle(error, { notFoundMessage: 'Merchant not found' });
    }
  }

  async verifyOwnership(id: string, userId: string): Promise<void> {
    const merchant = await this.merchantRepository.findByIdAndUserId(id, userId);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
  }
}
