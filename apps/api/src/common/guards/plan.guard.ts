// src/common/guards/plan.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CompanyPlan } from '@orby/types'
import { PLAN_KEY } from '../decorators/requires-plan.decorator'

const PLAN_HIERARCHY: CompanyPlan[] = [
  'FREE',
  'STARTER',
  'PRO',
  'ENTERPRISE',
]

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPlan = this.reflector.getAllAndOverride<CompanyPlan>(
      PLAN_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredPlan) return true

    const request = context.switchToHttp().getRequest()

    const company = request.company
    if (!company) return true

    const companyPlanIndex = PLAN_HIERARCHY.indexOf(company.plan)
    const requiredPlanIndex = PLAN_HIERARCHY.indexOf(requiredPlan)

    if (companyPlanIndex < requiredPlanIndex) {
      throw new ForbiddenException(
        `Esta función requiere el plan ${requiredPlan} o superior. ` +
        `Tu plan actual es ${company.plan}.`,
      )
    }

    return true
  }
}