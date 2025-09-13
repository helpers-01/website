import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Attaches a stable per-request ID to the response and logs.
 * - Respects inbound x-request-id if provided by a proxy/gateway
 * - Sets x-request-id header on response
 * - Stores requestId on res.locals.requestId for middleware/handlers
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const inbound = (req.headers['x-request-id'] as string) || undefined;
  const id = inbound || randomUUID();

  res.setHeader('x-request-id', id);
  (res.locals as any).requestId = id;

  next();
};

/**
 * Helper to retrieve the current request id from response context
 */
export const getRequestId = (res: Response): string | undefined => {
  return (res.getHeader('x-request-id') as string) || (res.locals?.requestId as string) || undefined;
};