import { AgentType } from '../enums'

export interface IAgent {
  id: string
  name: string
  description?: string
  type: AgentType
  isActive: boolean
  companyId: string
  createdAt: Date
  updatedAt: Date
}