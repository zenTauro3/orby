import { IsEmail, IsString } from 'class-validator'
import { LoginRequest } from '@orby/types'

export class LoginDto implements LoginRequest {
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}