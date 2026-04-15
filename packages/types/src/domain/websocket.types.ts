export type WsEventType =
  | 'message.new'
  | 'conversation.updated'
  | 'agent.processing'
  | 'agent.done'
  | 'invoice.created'

export interface WsEvent<T = unknown> {
  event: WsEventType
  data: T
  companyId: string
  timestamp: Date
}