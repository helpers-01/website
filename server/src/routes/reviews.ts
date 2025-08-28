import express from 'express';
import { supabaseAdmin } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { reviewSchema } from '@shared/validation/schemas';

const router = express.Router();

// GET /api/reviews/provider/:providerId - Get reviews for a provider
router.get('/provider/:providerId', asyncHandler(async (req, res) => {
  const { providerId } = req.params;

  const { data: reviews, error } = await supabaseAdmin
    .from('reviews')
    .select(`
      *,
      customer:profiles!customer_id(full_name, avatar_url),
      booking:bookings(service:services(name))
    `)
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw createError('Failed to fetch reviews', 500, 'FETCH_ERROR', error);
  }

  res.json({
    success: true,
    data: reviews,
  });
}));

// POST /api/reviews - Create new review
router.post('/', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const validation = reviewSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const userId = req.user!.id;
  const { booking_id, provider_id, rating, comment } = req.body;

  // Verify booking belongs to user and is completed
  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('id, customer_id, status')
    .eq('id', booking_id)
    .eq('customer_id', userId)
    .eq('status', 'completed')
    .single();

  if (!booking) {
    throw createError('Invalid booking or booking not completed', 400, 'INVALID_BOOKING');
  }

  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .insert({
      booking_id,
      customer_id: userId,
      provider_id,
      rating,
      comment,
    })
    .select()
    .single();

  if (error) {
    throw createError('Failed to create review', 500, 'CREATE_ERROR', error);
  }

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: review,
  });
}));

export default router;
