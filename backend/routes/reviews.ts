import express from 'express';
import {
  getProductReviews,
  createProductReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authHandler.js';

const router = express.Router({ mergeParams: true });

router.get('/', getProductReviews);
router.post('/', protect, createProductReview);

export default router;
