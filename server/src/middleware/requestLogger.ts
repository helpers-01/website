import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Skip logging for health check and static files
  if (req.path === '/health' || req.path.startsWith('/uploads')) {
    return next();
  }

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.socket.remoteAddress,
      contentLength: res.get('Content-Length'),
      requestId: res.get('x-request-id') || (req.headers['x-request-id'] as string | undefined),
    };

    // Log different levels based on status code
    if (res.statusCode >= 500) {
      logger.error('Server Error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Client Error', logData);
    } else if (res.statusCode >= 300) {
      logger.info('Redirect', logData);
    } else {
      logger.info('Success', logData);
    }
  });

  next();
};
