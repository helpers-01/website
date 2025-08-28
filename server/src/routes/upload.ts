import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  }
});

// POST /api/upload/avatar - Upload user avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), asyncHandler(async (req: AuthRequest, res) => {
  if (!req.file) {
    throw createError('No file uploaded', 400, 'NO_FILE');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  
  logger.info(`Avatar uploaded for user ${req.user!.id}: ${fileUrl}`);

  res.json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
    },
  });
}));

// POST /api/upload/service-image - Upload service image
router.post('/service-image', authenticateToken, upload.single('image'), asyncHandler(async (req: AuthRequest, res) => {
  if (!req.file) {
    throw createError('No file uploaded', 400, 'NO_FILE');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  
  logger.info(`Service image uploaded: ${fileUrl}`);

  res.json({
    success: true,
    message: 'Service image uploaded successfully',
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
    },
  });
}));

export default router;
