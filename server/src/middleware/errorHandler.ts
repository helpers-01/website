import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { handleApiError } from '@shared/utils';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error Handler:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  const { message, code, statusCode } = handleApiError(error);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        details: error.details 
      }),
    },
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  const message = `Route ${req.originalUrl} not found`;
  
  logger.warn(`404 - ${message}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    error: {
      message,
      code: 'NOT_FOUND',
    },
    timestamp: new Date().toISOString(),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const createError = (
  message: string,
  statusCode: number = 400,
  code: string = 'BAD_REQUEST',
  details?: any
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};
