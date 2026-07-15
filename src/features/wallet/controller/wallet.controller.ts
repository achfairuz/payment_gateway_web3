import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@auth/guards/jwt.guard';
import { MerchantOwnershipGuard } from '@merchant/guards/merchant-ownership.guard';
import { WalletService } from '../service/wallet.service';
import { CreateWalletDto, UpdateDefaultWalletDto, UpdateWalletDto } from '@wallet/dto/wallet.dto';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtGuard, MerchantOwnershipGuard)
@Controller('merchant/:merchantId/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new wallet for the merchant' })
  async create(@Param('merchantId') merchantId: string, @Body() body: CreateWalletDto) {
    return this.walletService.create(body, merchantId);
  }

  @Get()
  @ApiOperation({ summary: "List all of the merchant's wallets" })
  async findByMerchant(@Param('merchantId') merchantId: string) {
    return this.walletService.findByMerchantId(merchantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single wallet by id' })
  async findById(@Param('id') id: string) {
    return this.walletService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a wallet' })
  async update(
    @Param('id') id: string,
    @Param('merchantId') merchantId: string,
    @Body() body: UpdateWalletDto,
  ) {
    return this.walletService.update(id, merchantId, body);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set a wallet as the default one for the merchant' })
  async setDefault(
    @Param('id') id: string,
    @Param('merchantId') merchantId: string,
    @Body() body: UpdateDefaultWalletDto,
  ) {
    return this.walletService.setDefault(id, merchantId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wallet' })
  async delete(@Param('id') id: string, @Param('merchantId') merchantId: string) {
    return this.walletService.delete(id, merchantId);
  }
}
