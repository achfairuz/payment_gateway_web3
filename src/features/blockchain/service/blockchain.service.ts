import { Injectable } from '@nestjs/common';
import { BlockchainRepository } from '../repository/blockchain.repository';

@Injectable()
export class BlockchainService {
  constructor(private readonly blockchainRepository: BlockchainRepository) {}
}
