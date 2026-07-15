import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaErrorHandler } from '@common/handlers/prisma-error.handler';
import { ApiCredentialsHelper } from '@common/helpers/api-credentials.helper';
import { EncryptionService } from '@common/handlers/encrypt';
import {
  IMerchantRepository,
  MERCHANT_REPOSITORY,
} from '@merchant/interfaces/merchant.interface';
import { MerchantCreatedEntity, MerchantEntity } from '@merchant/entity/merchant.entity';
import { CreateMerchantDto, UpdateMerchantDto } from '@merchant/dto/merchant.dto';

@Injectable()
export class MerchantService {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepository: IMerchantRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(dto: CreateMerchantDto, userId: string): Promise<MerchantCreatedEntity> {
    const { apiKey, secretKey } = ApiCredentialsHelper.generate();
    const encryptedSecretKey = this.encryptionService.encrypt(secretKey);
    try {
      const merchant = await this.merchantRepository.createMerchant(
        dto.name,
        userId,
        apiKey,
        encryptedSecretKey,
      );
      return MerchantCreatedEntity.fromPrismaWithSecret(merchant, secretKey);
    } catch (error) {
      PrismaErrorHandler.handle(error, { conflictMessage: 'API key is already in use' });
    }
  }

  async findById(id: string, userId: string): Promise<MerchantEntity> {
    const merchant = await this.merchantRepository.findByIdAndUserId(id, userId);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    return MerchantEntity.fromPrisma(merchant);
  }

  async update(id: string, userId: string, dto: UpdateMerchantDto): Promise<MerchantEntity> {
    try {
      const merchant = await this.merchantRepository.updateMerchant(id, userId, dto.name);
      return MerchantEntity.fromPrisma(merchant);
    } catch (error) {
      PrismaErrorHandler.handle(error, { notFoundMessage: 'Merchant not found' });
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
