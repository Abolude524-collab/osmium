import express from 'express';
import {
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, requireAdmin } from '../middleware/authHandler.js';

const router = express.Router();

router.get('/my-orders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);

// Admin-only routes
router.get('/', protect, requireAdmin, getAllOrders);
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus);

export default router;
