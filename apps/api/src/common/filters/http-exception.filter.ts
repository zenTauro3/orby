import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ApiError } from '@orby/types'

@Catch() 
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const { statusCode, message, errors } = this.extractError(exception)

    this.logger.error(
      `${request.method} ${request.url} → ${statusCode}`,
      exception instanceof Error ? exception.stack : String(exception),
    )

    const body: ApiError = {
      success: false,
      statusCode,
      message,
      ...(errors && { errors }),
    }

    response.status(statusCode).json(body)
  }

  private extractError(exception: unknown): {
    statusCode: number
    message: string
    errors?: Record<string, string[]>
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse &&
        Array.isArray((exceptionResponse as Record<string, unknown>).message)
      ) {
        const validationMessages = (
          exceptionResponse as { message: string[] }
        ).message

        const errors = this.groupValidationErrors(validationMessages)

        return {
          statusCode,
          message: 'Error de validación',
          errors,
        }
      }

      return {
        statusCode,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as { message: string }).message ??
              exception.message,
      }
    }

    if (isPrismaNotFoundError(exception)) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Recurso no encontrado',
      }
    }

    if (isPrismaUniqueConstraintError(exception)) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Ya existe un registro con estos datos',
      }
    }

    this.logger.fatal('Error no controlado', exception)
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
    }
  }

  private groupValidationErrors(
    messages: string[],
  ): Record<string, string[]> {
    return messages.reduce<Record<string, string[]>>((acc, message) => {
      const field = message.split(' ')[0] ?? 'general'
      if (!acc[field]) acc[field] = []
      acc[field].push(message)
      return acc
    }, {})
  }
}

function isPrismaNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2025'
  )
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2002'
  )
}