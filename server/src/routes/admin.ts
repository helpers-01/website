import express from 'express';
import { supabaseAdmin } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { paginationSchema, updateUserRoleSchema, verifyProviderSchema } from '@shared/validation/schemas';
import { logger } from '../utils/logger';

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken);
router.use(requireRole('admin'));

// GET /api/admin/dashboard - Admin dashboard stats
router.get('/dashboard', asyncHandler(async (req: AuthRequest, res) => {
  try {
    // Get various statistics
    const [
      { count: totalUsers },
      { count: totalProviders },
      { count: totalBookings },
      { count: pendingBookings },
      { count: completedBookings },
      { count: totalServices },
    ] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('providers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabaseAdmin.from('services').select('*', { count: 'exact', head: true }),
    ]);

    // Get recent bookings
    const { data: recentBookings } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        customer:profiles!customer_id(full_name),
        provider:providers(business_name),
        service:services(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers: totalUsers || 0,
          totalProviders: totalProviders || 0,
          totalBookings: totalBookings || 0,
          pendingBookings: pendingBookings || 0,
          completedBookings: completedBookings || 0,
          totalServices: totalServices || 0,
        },
        recentBookings: recentBookings || [],
      },
    });
  } catch (error: any) {
    logger.error('Admin dashboard error:', error);
    throw createError('Failed to fetch dashboard data', 500, 'DASHBOARD_ERROR');
  }
}));

// GET /api/admin/users - Get all users with pagination
router.get('/users', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  
  const paginationValidation = paginationSchema.safeParse({ page: Number(page), limit: Number(limit) });
  if (!paginationValidation.success) {
    throw createError('Invalid pagination parameters', 400, 'VALIDATION_ERROR');
  }

  const { page: validPage, limit: validLimit } = paginationValidation.data;
  const offset = (validPage - 1) * validLimit;

  let query = supabaseAdmin
    .from('users')
    .select(`
      *,
      profile:profiles(full_name, phone, avatar_url)
    `)
    .range(offset, offset + validLimit - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,profiles.full_name.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq('role', role);
  }

  const { data: users, error, count } = await query;

  if (error) {
    throw createError('Failed to fetch users', 500, 'FETCH_ERROR', error);
  }

  const totalPages = count ? Math.ceil(count / validLimit) : 0;

  res.json({
    success: true,
    data: users,
    metadata: {
      page: validPage,
      limit: validLimit,
      total: count || 0,
      totalPages,
    },
  });
}));

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  
  const validation = updateUserRoleSchema.safeParse(req.body);
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const { role } = validation.data;

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update user role', 500, 'UPDATE_ERROR', error);
  }

  logger.info(`User role updated by admin`, {
    userId: id,
    newRole: role,
    adminId: req.user!.id,
  });

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: user,
  });
}));

// GET /api/admin/providers - Get all providers with verification status
router.get('/providers', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 20, status } = req.query;
  
  const paginationValidation = paginationSchema.safeParse({ page: Number(page), limit: Number(limit) });
  if (!paginationValidation.success) {
    throw createError('Invalid pagination parameters', 400, 'VALIDATION_ERROR');
  }

  const { page: validPage, limit: validLimit } = paginationValidation.data;
  const offset = (validPage - 1) * validLimit;

  let query = supabaseAdmin
    .from('providers')
    .select(`
      *,
      user:profiles(full_name, phone, email)
    `)
    .range(offset, offset + validLimit - 1);

  if (status) {
    query = query.eq('verification_status', status);
  }

  const { data: providers, error, count } = await query;

  if (error) {
    throw createError('Failed to fetch providers', 500, 'FETCH_ERROR', error);
  }

  const totalPages = count ? Math.ceil(count / validLimit) : 0;

  res.json({
    success: true,
    data: providers,
    metadata: {
      page: validPage,
      limit: validLimit,
      total: count || 0,
      totalPages,
    },
  });
}));

// PUT /api/admin/providers/:id/verify - Verify or reject provider
router.put('/providers/:id/verify', asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  
  const validation = verifyProviderSchema.safeParse(req.body);
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const { status, rejection_reason } = validation.data;

  const updateData: any = {
    verification_status: status,
    verified_at: status === 'verified' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (status === 'rejected' && rejection_reason) {
    updateData.rejection_reason = rejection_reason;
  }

  const { data: provider, error } = await supabaseAdmin
    .from('providers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update provider verification', 500, 'UPDATE_ERROR', error);
  }

  logger.info(`Provider verification updated by admin`, {
    providerId: id,
    status,
    adminId: req.user!.id,
  });

  res.json({
    success: true,
    message: `Provider ${status} successfully`,
    data: provider,
  });
}));

// GET /api/admin/bookings - Get all bookings
router.get('/bookings', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 20, status } = req.query;
  
  const paginationValidation = paginationSchema.safeParse({ page: Number(page), limit: Number(limit) });
  if (!paginationValidation.success) {
    throw createError('Invalid pagination parameters', 400, 'VALIDATION_ERROR');
  }

  const { page: validPage, limit: validLimit } = paginationValidation.data;
  const offset = (validPage - 1) * validLimit;

  let query = supabaseAdmin
    .from('bookings')
    .select(`
      *,
      customer:profiles!customer_id(full_name, phone),
      provider:providers(business_name),
      service:services(name, base_price)
    `)
    .range(offset, offset + validLimit - 1)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data: bookings, error, count } = await query;

  if (error) {
    throw createError('Failed to fetch bookings', 500, 'FETCH_ERROR', error);
  }

  const totalPages = count ? Math.ceil(count / validLimit) : 0;

  res.json({
    success: true,
    data: bookings,
    metadata: {
      page: validPage,
      limit: validLimit,
      total: count || 0,
      totalPages,
    },
  });
}));

// DELETE /api/admin/users/:id - Delete user (soft delete)
router.delete('/users/:id', asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  // Soft delete by updating status
  const { error } = await supabaseAdmin
    .from('users')
    .update({ 
      is_active: false,
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw createError('Failed to delete user', 500, 'DELETE_ERROR', error);
  }

  logger.info(`User deleted by admin`, {
    userId: id,
    adminId: req.user!.id,
  });

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
}));

export default router;