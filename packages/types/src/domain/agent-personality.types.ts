export interface AgentPersonality {
  tone: 'formal' | 'friendly' | 'neutral'
  language: 'es' | 'en' | 'ca'
  instructions: string
  signatureName: string
  autoReply: boolean
  escalateOnKeywords: string[]
}