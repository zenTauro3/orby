// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface IUser {
  id: string;
  email: string;
  name: string;
  companyId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Company ──────────────────────────────────────────────────────────────────

export type CompanyPlan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export interface ICompany {
  id: string;
  name: string;
  slug: string;
  plan: CompanyPlan;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export type AgentType = 'SALES' | 'SUPPORT' | 'ONBOARDING' | 'CUSTOM';

export interface IAgent {
  id: string;
  name: string;
  description?: string;
  type: AgentType;
  isActive: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Invoice ──────────────────────────────────────────────────────────────────

export type InvoiceStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'PAID'
  | 'VOID'
  | 'UNCOLLECTIBLE';

export interface IInvoice {
  id: string;
  companyId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  stripeInvoiceId?: string;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
}

// ─── Conversation ─────────────────────────────────────────────────────────────

export type ConversationStatus = 'ACTIVE' | 'CLOSED' | 'PENDING';

export interface IConversation {
  id: string;
  agentId: string;
  companyId: string;
  externalId?: string;
  status: ConversationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Message ──────────────────────────────────────────────────────────────────

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface IMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}
