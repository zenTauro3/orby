import { UserRole } from '../enums'

export interface IUser {
  id: string
  email: string
  name: string
  role: UserRole
  companyId: string | null
  createdAt: Date
  updatedAt: Date
}