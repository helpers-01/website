export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | string;

export interface ApiErrorPayload {
  message: string;
  code?: ApiErrorCode;
  statusCode?: number;
  details?: unknown;
}

/**
 * Centralized API Error for consistent error handling across the backend.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ApiErrorCode;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code: ApiErrorCode = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new ApiError(message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized', details?: unknown) {
    return new ApiError(message, 401, 'UNAUTHORIZED', details);
  }

  static forbidden(message = 'Forbidden', details?: unknown) {
    return new ApiError(message, 403, 'FORBIDDEN', details);
  }

  static notFound(message = 'Not Found', details?: unknown) {
    return new ApiError(message, 404, 'NOT_FOUND', details);
  }

  static conflict(message = 'Conflict', details?: unknown) {
    return new ApiError(message, 409, 'CONFLICT', details);
  }

  static validation(message = 'Validation failed', details?: unknown) {
    return new ApiError(message, 400, 'VALIDATION_ERROR', details);
  }

  static internal(message = 'Internal server error', details?: unknown) {
    return new ApiError(message, 500, 'INTERNAL_ERROR', details);
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      ...(this.details !== undefined ? { details: this.details } : {}),
    };
  }
}

export default ApiError;