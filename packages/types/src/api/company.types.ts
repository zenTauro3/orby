import { CompanyPlan } from '../enums'

export interface CreateCompanyRequest {
  name: string
  slug?: string
}

export interface UpdateCompanyRequest {
  name?: string
  plan?: CompanyPlan
}