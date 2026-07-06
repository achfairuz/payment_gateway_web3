import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { email } }) as Promise<UserRecord | null>;
  }

  findById(id: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { id } }) as Promise<UserRecord | null>;
  }

  createUserWithMerchant(
    email: string,
    hashedPassword: string,
    merchantName: string,
  ): Promise<UserRecord> {
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        merchants: {
          create: {
            name: merchantName,
            apiKey: '',
            secretKey: '',
          },
        },
      },
    }) as Promise<UserRecord>;
  }

  async saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
  }

  findRefreshToken(userId: string, tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: { userId, tokenHash, expiresAt: { gt: new Date() } },
    });
  }

  async deleteRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
