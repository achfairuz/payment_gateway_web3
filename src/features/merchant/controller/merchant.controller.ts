import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@auth/guards/jwt.guard';
import { AuthenticatedRequest } from '@auth/interfaces/auth.interfaces';
import { MerchantService } from '../service/merchant.service';
import { CreateMerchantDto, UpdateMerchantDto } from '@merchant/dto/merchant.dto';

@ApiTags('Merchant')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new merchant' })
  async createMerchant(
    @Body() body: CreateMerchantDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.merchantService.create(body, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one of your merchants by id' })
  async findById(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.merchantService.findById(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a merchant name' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMerchantDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.merchantService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a merchant' })
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.merchantService.delete(id, req.user.id);
  }
}
