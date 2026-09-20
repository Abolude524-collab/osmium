import mongoose, { Document, Model } from 'mongoose';
import { ICoupon } from '../types/index.js';

export interface ICouponDocument extends Omit<ICoupon, '_id'>, Document {
  isValid(subtotal?: number): { valid: boolean; message?: string };
  calculateDiscount(subtotal: number): number;
}

const couponSchema = new mongoose.Schema<ICouponDocument>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      required: true,
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
    },
    expirationDate: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.methods.isValid = function (subtotal = 0) {
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (new Date() > new Date(this.expirationDate)) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit !== null && this.usageLimit !== undefined && this.usageCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  if (subtotal < this.minPurchaseAmount) return { valid: false, message: `Minimum purchase of ₦${this.minPurchaseAmount.toLocaleString()} required` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (subtotal: number) {
  const check = this.isValid(subtotal);
  if (!check.valid) return 0;

  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (subtotal * this.discountValue) / 100;
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else if (this.discountType === 'flat') {
    discount = Math.min(this.discountValue, subtotal);
  }

  return Math.round(discount * 100) / 100;
};

export const Coupon: Model<ICouponDocument> =
  mongoose.models.Coupon || mongoose.model<ICouponDocument>('Coupon', couponSchema);

export default Coupon;
