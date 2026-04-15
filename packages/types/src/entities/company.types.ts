import { CompanyPlan } from '../enums'

export interface ICompany {
  id: string
  name: string
  slug: string
  plan: CompanyPlan
  createdAt: Date
  updatedAt: Date
}