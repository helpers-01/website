import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import ApiError from '../utils/ApiError';

export type AppError =
  | ApiError
  | (Error & { statusCode?: number; code?: string; details?: unknown });

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const apiError =
    err instanceof ApiError
      ? err
      : new ApiError(
          err.message || 'Internal server error',
          (err as any).statusCode || 500,
          (err as any).code || 'INTERNAL_ERROR',
          (err as any).details
        );

  logger.error('Error Handler', {
    message: apiError.message,
    stack: (err as any).stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    requestId: res.get('x-request-id') || (req.headers['x-request-id'] as string | undefined),
  });

  // For 404 errors, return the exact format specified
  if (apiError.statusCode === 404) {
    res.status(404).json({
      error: "Not Found",
      status: 404
    });
    return;
  }

  // For 500 errors, return the exact format specified
  if (apiError.statusCode >= 500) {
    res.status(500).json({
      error: "Internal Server Error",
      status: 500
    });
    return;
  }

  // For other errors, return detailed format
  res.status(apiError.statusCode).json({
    success: false,
    error: {
      message: apiError.message,
      code: apiError.code,
      ...(process.env.NODE_ENV === 'development' && {
        stack: (err as any).stack,
        details: (apiError as any).details,
      }),
    },
    correlationId: res.get('x-request-id') || (req.headers['x-request-id'] as string | undefined),
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const message = `Route ${req.originalUrl} not found`;

  logger.warn(`404 - ${message}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    requestId: (req.headers['x-request-id'] as string | undefined),
  });

  // Return the exact format specified for 404 errors
  res.status(404).json({
    error: "Not Found",
    status: 404
  });
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const createError = (
  message: string,
  statusCode = 400,
  code = 'BAD_REQUEST',
  details?: unknown
) => new ApiError(message, statusCode, code, details);
