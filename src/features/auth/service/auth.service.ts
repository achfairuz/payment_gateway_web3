import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { ApiCredentialsHelper } from '@common/helpers/api-credentials.helper';
import { AuthTokens, JwtPayload, RegisterResult } from '../interfaces/auth.interfaces';
import { AuthRepository, UserRecord } from '../repository/auth.repository';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly REFRESH_EXPIRY_DAYS = 7;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(email: string, password: string, merchantName: string): Promise<RegisterResult> {
    const existing = await this.authRepository.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    const { apiKey, rawSecretKey, hashedSecretKey } = await ApiCredentialsHelper.generate();

    const user = await this.authRepository.createUserWithMerchant(
      email,
      hashedPassword,
      merchantName,
      apiKey,
      hashedSecretKey,
    );

    const tokens = await this.issueTokens({ sub: user.id, email: user.email, role: user.role });

    return {
      ...tokens,
      merchant: { apiKey, secretKey: rawSecretKey },
    };
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens({ sub: user.id, email: user.email, role: user.role });
  }

  async refresh(userId: string, rawRefreshToken: string): Promise<AuthTokens> {
    const tokenHash = this.hashToken(rawRefreshToken);
    const stored = await this.authRepository.findRefreshToken(userId, tokenHash);
    if (!stored) throw new UnauthorizedException('Invalid or expired refresh token');

    const user = await this.authRepository.findById(userId) as UserRecord | null;
    if (!user) throw new UnauthorizedException('User not found');

    await this.authRepository.deleteRefreshTokens(userId);
    return this.issueTokens({ sub: user.id, email: user.email, role: user.role });
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.deleteRefreshTokens(userId);
  }

  private async issueTokens(payload: JwtPayload): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: `${this.REFRESH_EXPIRY_DAYS}d`,
    });

    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_EXPIRY_DAYS);

    await this.authRepository.saveRefreshToken(payload.sub, tokenHash, expiresAt);

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
