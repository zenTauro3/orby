export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export type CompanyPlan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'

export type AgentType = 'SALES' | 'SUPPORT' | 'ONBOARDING' | 'CUSTOM'

export type InvoiceStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'PAID'
  | 'VOID'
  | 'UNCOLLECTIBLE'

export type ConversationStatus = 'ACTIVE' | 'CLOSED' | 'PENDING'

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM'