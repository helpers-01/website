import express from 'express';
import authRoutes from './auth';
import servicesRoutes from './services';
import providersRoutes from './providers';
import bookingsRoutes from './bookings';
import reviewsRoutes from './reviews';
import uploadRoutes from './upload';
import paymentsRoutes from './payments';
import adminRoutes from './admin';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Metadata and quick status for API v1
router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Helpers API v1',
    version: 'v1',
    timestamp: new Date().toISOString(),
  });
});

// Mount feature routers
router.use('/auth', authRoutes);
router.use('/services', servicesRoutes);
router.use('/providers', providersRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/upload', uploadRoutes);
router.use('/payments', paymentsRoutes);
router.use('/admin', adminRoutes);

// Error testing endpoint (for validation of error pipeline)
router.get('/errors/test', (_req, _res) => {
  throw createError('Test error thrown from API v1', 500, 'TEST_ERROR');
});

export default router;