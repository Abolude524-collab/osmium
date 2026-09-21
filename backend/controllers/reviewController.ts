import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/authHandler.js';

/**
 * @route   GET /api/products/:productId/reviews
 * @desc    Get paginated product reviews, rating average & distribution
 * @access  Public
 */
export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate rating distribution (5-star count down to 1-star count)
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRatingSum = 0;

    reviews.forEach((r: any) => {
      const rounded = Math.round(r.rating);
      if (distribution[rounded] !== undefined) {
        distribution[rounded] += 1;
      }
      totalRatingSum += r.rating;
    });

    const averageRating = reviews.length > 0 ? Math.round((totalRatingSum / reviews.length) * 10) / 10 : 0;

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        reviews,
        summary: {
          averageRating,
          totalReviews: reviews.length,
          distribution,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/:productId/reviews/eligibility
 * @desc    Check if authenticated user can review product (must have paid order)
 * @access  Private / Protected
 */
export const checkReviewEligibility = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const userId = req.user!._id;

    // 1. Check if user has already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(200).json({
        status: 'success',
        canReview: false,
        reason: 'already_reviewed',
        message: 'You have already submitted a review for this product.',
      });
    }

    // 2. Check purchase history for Paid order containing product
    const verifiedOrder = await Order.findOne({
      user: userId,
      'paymentInfo.status': 'paid',
      'orderItems.product': productId,
    });

    if (!verifiedOrder) {
      return res.status(200).json({
        status: 'success',
        canReview: false,
        reason: 'not_purchased',
        message: 'Only customers who have successfully purchased this product can leave a review.',
      });
    }

    res.status(200).json({
      status: 'success',
      canReview: true,
      message: 'Verified purchaser eligible to review.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/products/:productId/reviews
 * @desc    Create product review strictly for verified purchasers
 * @access  Private / Protected
 */
export const createProductReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user!._id;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400);
      return next(new Error('Rating must be an integer between 1 and 5'));
    }

    if (!comment || !comment.trim()) {
      res.status(400);
      return next(new Error('Review comment is required'));
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      return next(new Error(`Product not found with ID '${productId}'`));
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      res.status(400);
      return next(new Error('You have already submitted a review for this product'));
    }

    // Strictly enforce purchase history requirement
    const verifiedOrder = await Order.findOne({
      user: userId,
      'paymentInfo.status': 'paid',
      'orderItems.product': productId,
    });

    if (!verifiedOrder) {
      res.status(403);
      return next(new Error('Only customers who have successfully purchased this product can leave a review.'));
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating: Number(rating),
      title: title ? title.trim() : '',
      comment: comment.trim(),
      isVerifiedPurchase: true,
    });

    res.status(201).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (error) {
    next(error);
  }
};
