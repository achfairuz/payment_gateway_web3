import { Global, Module } from '@nestjs/common';
import { EncryptionService } from './handlers/encrypt';

@Global()
@Module({
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class CommonModule {}
