import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MerchantRepository {
  constructor(private readonly prisma: PrismaService) { }

  findById(id: string) {
    return this.prisma.merchant.findUnique({ where: { id } });
  }
  createMerchant(name: string, userId: string, apiKey: string, secretKey: string) {
    return this.prisma.merchant.create({
      data: {
        name,
        userId,
        apiKey,
        secretKey,
      },
    });
  }

  updateMerchant(id: string, userId: string, name: string, apiKey: string, secretKey: string) {
    return this.prisma.merchant.update({
      where: { id, userId },
      data: {
        name,
        apiKey,
        secretKey,
      },
    });
  }
  deleteMerchant(id: string, userId: string) {
    return this.prisma.merchant.delete({
      where: { id, userId },
    });
  }
}
