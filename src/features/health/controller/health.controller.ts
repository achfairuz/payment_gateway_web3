import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from '../service/health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
}
