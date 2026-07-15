import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlockchainService } from '../service/blockchain.service';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}
}
