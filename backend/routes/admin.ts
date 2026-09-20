import express from 'express';
import { getAdminMetrics, getAdminCustomers } from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authHandler.js';

const router = express.Router();

router.get('/metrics', protect, requireAdmin, getAdminMetrics);
router.get('/customers', protect, requireAdmin, getAdminCustomers);

export default router;
