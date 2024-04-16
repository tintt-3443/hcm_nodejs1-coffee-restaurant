import { Invoice } from '../entities/Invoice';
import { BaseRepository } from './base.repository';

export class InvoiceRepository extends BaseRepository<Invoice> {
  constructor() {
    super(Invoice);
  }
}
