import express from 'express';
import {
  getProductReviews,
  checkReviewEligibility,
  createProductReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authHandler.js';

const router = express.Router({ mergeParams: true });

router.get('/', getProductReviews);
router.get('/eligibility', protect, checkReviewEligibility);
router.post('/', protect, createProductReview);

export default router;
