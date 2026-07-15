import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@auth/guards/jwt.guard';
import { AuthenticatedRequest } from '@auth/interfaces/auth.interfaces';
import { MerchantService } from '../service/merchant.service';
import { CreateMerchantDto } from '@merchant/dto/merchant.dto';

@ApiTags('Merchant')
@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post('create')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new merchant' })
  async createMerchant(
    @Body() body: CreateMerchantDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.merchantService.create(body, req.user.id);
  }
}
