import express from 'express';
import { supabaseAdmin } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { registerSchema, loginSchema, updateProfileSchema } from '@shared/validation/schemas';
import { logger } from '../utils/logger';

const router = express.Router();

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const { email, password, full_name, phone, role } = validation.data;

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email in development
      user_metadata: {
        full_name,
        role,
      },
    });

    if (authError) {
      throw createError(authError.message, 400, 'AUTH_ERROR');
    }

    if (!authData.user) {
      throw createError('Failed to create user', 500, 'USER_CREATION_ERROR');
    }

    // Create user profile in our custom tables
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name,
        phone,
        avatar_url: null,
      });

    if (profileError) {
      logger.error('Failed to create profile:', profileError);
      // If profile creation fails, we should clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw createError('Failed to create user profile', 500, 'PROFILE_CREATION_ERROR');
    }

    // Update user role in auth metadata
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ role })
      .eq('id', authData.user.id);

    if (updateError) {
      logger.warn('Failed to update user role:', updateError);
    }

    logger.info(`New user registered: ${email} with role: ${role}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name,
          role,
        },
      },
    });
  } catch (error: any) {
    if (error.code === '23505') {
      throw createError('Email already exists', 409, 'EMAIL_EXISTS');
    }
    throw error;
  }
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const { email, password } = validation.data;

  try {
    // Sign in user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw createError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (!data.user || !data.session) {
      throw createError('Login failed', 401, 'LOGIN_FAILED');
    }

    // Get user profile data
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: profile?.full_name,
          phone: profile?.phone,
          avatar_url: profile?.avatar_url,
          role: userData?.role || 'customer',
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      },
    });
  } catch (error: any) {
    if (error.message?.includes('Invalid login credentials')) {
      throw createError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }
    throw error;
  }
}));

// POST /api/auth/logout
router.post('/logout', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      // Sign out user from Supabase
      await supabaseAdmin.auth.admin.signOut(token);
    } catch (error) {
      logger.warn('Failed to sign out user from Supabase:', error);
    }
  }

  logger.info(`User logged out: ${req.user?.email}`);

  res.json({
    success: true,
    message: 'Logout successful',
  });
}));

// GET /api/auth/profile
router.get('/profile', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    throw createError('Profile not found', 404, 'PROFILE_NOT_FOUND');
  }

  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('role, email')
    .eq('id', userId)
    .single();

  res.json({
    success: true,
    data: {
      user: {
        id: userId,
        email: userData?.email || req.user!.email,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        role: userData?.role || 'customer',
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
    },
  });
}));

// PUT /api/auth/profile
router.put('/profile', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const validation = updateProfileSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const userId = req.user!.id;
  const updateData = validation.data;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update profile', 500, 'UPDATE_FAILED', error);
  }

  logger.info(`Profile updated for user: ${req.user!.email}`);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: data,
    },
  });
}));

// POST /api/auth/refresh
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw createError('Refresh token is required', 400, 'REFRESH_TOKEN_REQUIRED');
  }

  try {
    const { data, error } = await supabaseAdmin.auth.refreshSession({ 
      refresh_token 
    });

    if (error) {
      throw createError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_at: data.session?.expires_at,
        },
      },
    });
  } catch (error: any) {
    throw createError('Token refresh failed', 401, 'REFRESH_FAILED');
  }
}));

export default router;
