import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase';
import { createError } from './errorHandler';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('Access token is required', 401, 'UNAUTHORIZED');
    }

    // Verify JWT token with Supabase JWT secret
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret) {
      throw createError('JWT secret not configured', 500, 'CONFIG_ERROR');
    }

    const payload = jwt.verify(token, jwtSecret) as any;
    
    // Get user data from Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        email,
        role,
        profiles (
          full_name,
          phone,
          avatar_url
        )
      `)
      .eq('id', payload.sub)
      .single();

    if (error || !user) {
      logger.warn('User not found in database:', payload.sub);
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(createError('Invalid access token', 401, 'INVALID_TOKEN'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError('Access token expired', 401, 'TOKEN_EXPIRED'));
    }
    next(error);
  }
};

export const requireRole = (allowedRoles: string | string[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('User not authenticated', 401, 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          `Access denied. Required role(s): ${roles.join(', ')}`,
          403,
          'INSUFFICIENT_PERMISSIONS'
        )
      );
    }

    next();
  };
};

// Optional authentication - adds user to request if token is provided but doesn't fail if missing
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without user
    }

    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret) {
      return next(); // Continue without user if JWT secret not configured
    }

    const payload = jwt.verify(token, jwtSecret) as any;
    
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('id', payload.sub)
      .single();

    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    next();
  } catch (error) {
    // Ignore token errors for optional auth
    next();
  }
};

// Middleware to check if user owns resource or is admin
export const requireOwnership = (userIdField = 'user_id') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('User not authenticated', 401, 'UNAUTHORIZED'));
    }

    const resourceUserId = req.body[userIdField] || req.params[userIdField];
    
    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      return next();
    }

    next(createError('Access denied. Not authorized to access this resource', 403, 'FORBIDDEN'));
  };
};
