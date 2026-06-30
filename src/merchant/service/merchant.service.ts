import { Injectable } from '@nestjs/common';
import { MerchantRepository } from '../repository/merchant.repository';

@Injectable()
export class MerchantService {
  constructor(private readonly merchantRepository: MerchantRepository) {}
}
