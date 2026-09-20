import express from 'express';
import { getAdminAnalytics } from '../controllers/analyticsController.js';
import { protect, requireAdmin } from '../middleware/authHandler.js';

const router = express.Router();

router.get('/', protect, requireAdmin, getAdminAnalytics);

export default router;
