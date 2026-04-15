import { IsString, IsNotEmpty } from 'class-validator'
import { RefreshRequest } from '@orby/types'

export class RefreshDto implements RefreshRequest {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string
}