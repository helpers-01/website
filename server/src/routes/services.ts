import express from 'express';
import { supabaseAdmin } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { serviceSchema, serviceCategorySchema, paginationSchema } from '../../../shared/validation/schemas';

const router = express.Router();

// GET /api/services - Get all services with optional filtering
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, search, is_active = 'true' } = req.query;
  
  const paginationValidation = paginationSchema.safeParse({ page: Number(page), limit: Number(limit) });
  if (!paginationValidation.success) {
    throw createError('Invalid pagination parameters', 400, 'VALIDATION_ERROR');
  }

  const { page: validPage, limit: validLimit } = paginationValidation.data;
  const offset = (validPage - 1) * validLimit;

  let query = supabaseAdmin
    .from('services')
    .select(`
      *,
      category:service_categories(id, name, description, icon)
    `)
    .eq('is_active', is_active === 'true')
    .range(offset, offset + validLimit - 1);

  if (category) {
    query = query.eq('category_id', category);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data: services, error, count } = await query;

  if (error) {
    throw createError('Failed to fetch services', 500, 'FETCH_ERROR', error);
  }

  const totalPages = count ? Math.ceil(count / validLimit) : 0;

  res.json({
    success: true,
    data: services,
    metadata: {
      page: validPage,
      limit: validLimit,
      total: count || 0,
      totalPages,
    },
  });
}));

// Service Categories Routes (must come before parameterized routes)

// GET /api/services/categories - Get all categories
router.get('/categories', asyncHandler(async (req, res) => {
  const { is_active = 'true' } = req.query;

  const { data: categories, error } = await supabaseAdmin
    .from('service_categories')
    .select('*')
    .eq('is_active', is_active === 'true')
    .order('name');

  if (error) {
    throw createError('Failed to fetch categories', 500, 'FETCH_ERROR', error);
  }

  res.json({
    success: true,
    data: categories,
  });
}));

// POST /api/services/categories - Create category (Admin only)
router.post('/categories', authenticateToken, requireRole('admin'), asyncHandler(async (req: AuthRequest, res) => {
  const validation = serviceCategorySchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const categoryData = validation.data;

  const { data: category, error } = await supabaseAdmin
    .from('service_categories')
    .insert(categoryData)
    .select()
    .single();

  if (error) {
    throw createError('Failed to create category', 500, 'CREATE_ERROR', error);
  }

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
}));

// PUT /api/services/categories/:id - Update category (Admin only)
router.put('/categories/:id', authenticateToken, requireRole('admin'), asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const validation = serviceCategorySchema.partial().safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const updateData = {
    ...validation.data,
    updated_at: new Date().toISOString(),
  };

  const { data: category, error } = await supabaseAdmin
    .from('service_categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update category', 500, 'UPDATE_ERROR', error);
  }

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
}));

// GET /api/services/:id - Get service by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: service, error } = await supabaseAdmin
    .from('services')
    .select(`
      *,
      category:service_categories(id, name, description, icon)
    `)
    .eq('id', id)
    .single();

  if (error || !service) {
    throw createError('Service not found', 404, 'SERVICE_NOT_FOUND');
  }

  res.json({
    success: true,
    data: service,
  });
}));

// POST /api/services - Create new service (Admin only)
router.post('/', authenticateToken, requireRole('admin'), asyncHandler(async (req: AuthRequest, res) => {
  const validation = serviceSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const serviceData = validation.data;

  const { data: service, error } = await supabaseAdmin
    .from('services')
    .insert(serviceData)
    .select()
    .single();

  if (error) {
    throw createError('Failed to create service', 500, 'CREATE_ERROR', error);
  }

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service,
  });
}));

// PUT /api/services/:id - Update service (Admin only)
router.put('/:id', authenticateToken, requireRole('admin'), asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const validation = serviceSchema.partial().safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const updateData = {
    ...validation.data,
    updated_at: new Date().toISOString(),
  };

  const { data: service, error } = await supabaseAdmin
    .from('services')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update service', 500, 'UPDATE_ERROR', error);
  }

  res.json({
    success: true,
    message: 'Service updated successfully',
    data: service,
  });
}));

// DELETE /api/services/:id - Delete service (Admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError('Failed to delete service', 500, 'DELETE_ERROR', error);
  }

  res.json({
    success: true,
    message: 'Service deleted successfully',
  });
}));

export default router;
