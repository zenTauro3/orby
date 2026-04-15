import { CompanyPlan } from '../enums'

export interface PlanFeatures {
  maxAgents: number
  maxEmailsPerMonth: number  
  whatsappEnabled: boolean
  calendarEnabled: boolean
  apiAccess: boolean
}

export const PLAN_FEATURES: Record<CompanyPlan, PlanFeatures> = {
  FREE: {
    maxAgents: 1,
    maxEmailsPerMonth: 50,
    whatsappEnabled: false,
    calendarEnabled: false,
    apiAccess: false,
  },
  STARTER: {
    maxAgents: 1,
    maxEmailsPerMonth: 200,
    whatsappEnabled: false,
    calendarEnabled: false,
    apiAccess: false,
  },
  PRO: {
    maxAgents: 3,
    maxEmailsPerMonth: -1,
    whatsappEnabled: true,
    calendarEnabled: true,
    apiAccess: false,
  },
  ENTERPRISE: {
    maxAgents: -1,
    maxEmailsPerMonth: -1,
    whatsappEnabled: true,
    calendarEnabled: true,
    apiAccess: true,
  },
}