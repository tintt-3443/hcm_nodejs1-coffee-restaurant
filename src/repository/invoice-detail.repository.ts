import { InvoiceDetail } from '../entities/InvoiceDetail';
import { BaseRepository } from './base.repository';

export class InvoiceDetailRepository extends BaseRepository<InvoiceDetail> {
  constructor() {
    super(InvoiceDetail);
  }
}
