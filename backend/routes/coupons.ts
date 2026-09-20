import express from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, requireAdmin } from '../middleware/authHandler.js';

const router = express.Router();

// Public validation endpoint
router.post('/validate', validateCoupon);

// Admin-only management endpoints
router.get('/', protect, requireAdmin, getCoupons);
router.post('/', protect, requireAdmin, createCoupon);
router.patch('/:id/toggle', protect, requireAdmin, toggleCouponStatus);
router.delete('/:id', protect, requireAdmin, deleteCoupon);

export default router;
