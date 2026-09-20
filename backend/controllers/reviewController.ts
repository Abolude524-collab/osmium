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
 * @route   POST /api/products/:productId/reviews
 * @desc    Create product review & verify purchase history
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

    // Check purchase history for Verified Purchaser status
    const verifiedOrder = await Order.findOne({
      user: userId,
      'paymentInfo.status': 'paid',
      'orderItems.product': productId,
    });

    const isVerifiedPurchase = Boolean(verifiedOrder);

    const review = await Review.create({
      user: userId,
      product: productId,
      rating: Number(rating),
      title: title ? title.trim() : '',
      comment: comment.trim(),
      isVerifiedPurchase,
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
