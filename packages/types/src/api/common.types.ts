export interface ApiResponse<T> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  statusCode: number
  message: string
  errors?: Record<string, string[]> 
}

export type ApiResult<T> = ApiResponse<T> | ApiError

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}