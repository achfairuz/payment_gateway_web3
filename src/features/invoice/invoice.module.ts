import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { InvoiceController } from './controller/invoice.controller';
import { InvoiceService } from './service/invoice.service';
import { InvoiceRepository } from './repository/invoice.repository';

@Module({
  imports: [PrismaModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
  exports: [InvoiceService],
})
export class InvoiceModule {}
