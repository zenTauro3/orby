import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
import { RegisterRequest } from '@orby/types'

export class RegisterDto implements RegisterRequest {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string 

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string
}