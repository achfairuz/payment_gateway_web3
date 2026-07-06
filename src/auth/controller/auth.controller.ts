import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { AuthService } from '../service/auth.service';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  refreshToken?: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register merchant account' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.merchantName);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get access + refresh token' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refresh(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.authService.refresh(user.id, user.refreshToken!);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  async logout(@Req() req: Request) {
    const user = req.user as AuthUser;
    await this.authService.logout(user.id);
    return null;
  }
}
