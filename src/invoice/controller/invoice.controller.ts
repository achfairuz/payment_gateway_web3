import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvoiceService } from '../service/invoice.service';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
}
