import { AgentType } from '../enums'
import { IAgent } from '../entities/agent.types'
import { IMessage } from '../entities/message.types'
import { IConversation } from '../entities/conversation.types'

export interface CreateAgentRequest {
  name: string
  description?: string
  type: AgentType
}

export interface UpdateAgentRequest {
  name?: string
  description?: string
  type?: AgentType
  isActive?: boolean
}

export interface ConversationWithMessages extends IConversation {
  messages: IMessage[]
  agent: Pick<IAgent, 'id' | 'name' | 'type'>
}