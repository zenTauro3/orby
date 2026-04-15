import { InvoiceStatus } from '../enums'

export interface IInvoice {
  id: string
  amount: number   
  currency: string
  status: InvoiceStatus
  stripeInvoiceId?: string
  dueDate: Date
  paidAt?: Date
  companyId: string
  createdAt: Date
}