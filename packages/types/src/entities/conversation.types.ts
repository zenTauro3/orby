import { ConversationStatus } from '../enums'

export interface IConversation {
  id: string
  externalId?: string
  status: ConversationStatus
  agentId: string
  createdAt: Date
  updatedAt: Date
}