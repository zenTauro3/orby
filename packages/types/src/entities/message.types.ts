import { MessageRole } from '../enums'

export interface IMessage {
  id: string
  role: MessageRole
  content: string
  conversationId: string
  createdAt: Date
}