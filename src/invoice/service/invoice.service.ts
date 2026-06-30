import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../repository/invoice.repository';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}
}
