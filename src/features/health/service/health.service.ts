import { Injectable } from '@nestjs/common';
import { HealthRepository } from '../repository/health.repository';

@Injectable()
export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}
}
