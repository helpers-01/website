import express from 'express';
import { supabaseAdmin } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { bookingSchema } from '@shared/validation/schemas';

const router = express.Router();

// GET /api/bookings/user - Get user's bookings
router.get('/user', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      provider:providers(
        id,
        business_name,
        user:profiles(full_name, phone)
      ),
      service:services(id, name, description)
    `)
    .eq('customer_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw createError('Failed to fetch bookings', 500, 'FETCH_ERROR', error);
  }

  res.json({
    success: true,
    data: bookings,
  });
}));

// POST /api/bookings - Create new booking
router.post('/', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const validation = bookingSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const userId = req.user!.id;
  const bookingData = {
    ...validation.data,
    customer_id: userId,
    status: 'pending',
    total_amount: 0, // Calculate based on service price
  };

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();

  if (error) {
    throw createError('Failed to create booking', 500, 'CREATE_ERROR', error);
  }

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
}));

// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .update({ 
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update booking status', 500, 'UPDATE_ERROR', error);
  }

  res.json({
    success: true,
    message: 'Booking status updated successfully',
    data: booking,
  });
}));

export default router;
