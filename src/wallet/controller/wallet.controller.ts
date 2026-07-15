import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from '../service/wallet.service';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {

  }
}
