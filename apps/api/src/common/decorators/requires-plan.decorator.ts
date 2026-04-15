import { SetMetadata } from '@nestjs/common'
import { CompanyPlan } from '@orby/types'

export const PLAN_KEY = 'requiredPlan'

export const RequiresPlan = (plan: CompanyPlan) =>
  SetMetadata(PLAN_KEY, plan)