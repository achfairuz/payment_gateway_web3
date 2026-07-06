import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponseHelper } from '@common/helpers/response.helper';
import { Prisma } from '../../../generated/prisma/client';
import { MerchantRepository } from '../repository/merchant.repository';
import { CreateMerchantResponse } from '@merchant/interfaces/merchant.interface';

@Injectable()
export class MerchantService {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async create(
    name: string,
    userId: string,
    apiKey: string,
    secretKey: string,
  ): Promise<CreateMerchantResponse> {
    try {
      const merchant = await this.merchantRepository.createMerchant(
        name,
        userId,
        apiKey,
        secretKey,
      );
      return {
        name: merchant.name,
        userId: merchant.userId,
      };
    } catch (error) {
      this.handleError(error, 'API key is already in use');
    }
  }

  async findById(id: string) {
    try {
      const merchant = await this.merchantRepository.findById(id);
      if (!merchant) {
        throw new NotFoundException('Merchant not found');
      }
      return merchant;
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
  ) {
    try {
      return await this.merchantRepository.updateMerchant(
        id,
        userId,
        name,
        apiKey,
        secretKey,
      );
    } catch (error) {
      this.handleError(
        error,
        'API key is already in use',
        'Merchant not found',
      );
    }
  }

  async delete(id: string, userId: string) {
    try {
      return await this.merchantRepository.deleteMerchant(id, userId);
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
