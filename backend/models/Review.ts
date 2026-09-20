import mongoose, { Document, Model } from 'mongoose';
import { IReview } from '../types/index.js';

export interface IReviewDocument extends Omit<IReview, '_id'>, Document {}

const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating score is required'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'Review headline title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment body is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a user from leaving multiple reviews for the exact same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const Review: Model<IReviewDocument> =
  mongoose.models.Review || mongoose.model<IReviewDocument>('Review', reviewSchema);

export default Review;
