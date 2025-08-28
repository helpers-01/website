import express from 'express';
import { supabaseAdmin } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/providers - Get all providers with services
router.get('/', asyncHandler(async (req, res) => {
  const { data: providers, error } = await supabaseAdmin
    .from('providers')
    .select(`
      *,
      user:profiles(full_name, avatar_url),
      services:provider_services(
        id,
        custom_price,
        is_available,
        service:services(id, name, description, base_price)
      )
    `)
    .eq('verification_status', 'verified');

  if (error) {
    throw createError('Failed to fetch providers', 500, 'FETCH_ERROR', error);
  }

  res.json({
    success: true,
    data: providers,
  });
}));

// GET /api/providers/:id - Get provider by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: provider, error } = await supabaseAdmin
    .from('providers')
    .select(`
      *,
      user:profiles(full_name, avatar_url, phone),
      services:provider_services(
        id,
        custom_price,
        is_available,
        service:services(id, name, description, base_price, duration_minutes)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !provider) {
    throw createError('Provider not found', 404, 'PROVIDER_NOT_FOUND');
  }

  res.json({
    success: true,
    data: provider,
  });
}));

// POST /api/providers/register - Register as provider
router.post('/register', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { business_name, description, service_areas, hourly_rate } = req.body;

  const { data: provider, error } = await supabaseAdmin
    .from('providers')
    .insert({
      user_id: userId,
      business_name,
      description,
      service_areas,
      hourly_rate,
      verification_status: 'pending',
    })
    .select()
    .single();

  if (error) {
    throw createError('Failed to register as provider', 500, 'REGISTRATION_ERROR', error);
  }

  res.status(201).json({
    success: true,
    message: 'Provider registration submitted for verification',
    data: provider,
  });
}));

export default router;
