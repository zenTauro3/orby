import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiResponse, PaginatedResponse } from '@orby/types'

export const RAW_RESPONSE = Symbol('RAW_RESPONSE')

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | PaginatedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | PaginatedResponse<T>> {
    const handler = context.getHandler()
    if (Reflect.getMetadata(RAW_RESPONSE, handler)) {
      return next.handle()
    }

    return next.handle().pipe(
      map((data): ApiResponse<T> | PaginatedResponse<T> => {
        if (isPaginatedResponse(data)) {
          return data as unknown as PaginatedResponse<T>
        }

        return {
          success: true,
          data: data as T,
        }
      }),
    )
  }
}

function isPaginatedResponse(data: unknown): data is PaginatedResponse<unknown> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    'pagination' in data &&
    'data' in data &&
    Array.isArray((data as Record<string, unknown>).data)
  )
}