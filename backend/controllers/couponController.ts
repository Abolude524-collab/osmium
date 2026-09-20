import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';

/**
 * @desc    Validate coupon code and return discount amount
 * @route   POST /api/coupons/validate
 * @access  Public
 */
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid coupon code.',
      });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code.',
      });
    }

    const validation = coupon.isValid(subtotal);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const discountAmount = coupon.calculateDiscount(subtotal);

    return res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        minPurchaseAmount: coupon.minPurchaseAmount,
      },
      message: `Coupon '${coupon.code}' applied successfully!`,
    });
  } catch (error: any) {
    console.error('[Coupon Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate coupon code.',
    });
  }
};

/**
 * @desc    Get all coupons (Admin)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    console.error('[Coupon Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons.',
    });
  }
};

/**
 * @desc    Create new coupon (Admin)
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      discountType = 'percentage',
      discountValue,
      minPurchaseAmount = 0,
      maxDiscountAmount = null,
      expirationDate,
      usageLimit = null,
    } = req.body;

    if (!code || !discountValue || !expirationDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide code, discount value, and expiration date.',
      });
    }

    const formattedCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: formattedCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon code '${formattedCode}' already exists.`,
      });
    }

    const coupon = await Coupon.create({
      code: formattedCode,
      discountType,
      discountValue: Number(discountValue),
      minPurchaseAmount: Number(minPurchaseAmount) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      expirationDate: new Date(expirationDate),
      usageLimit: usageLimit ? Number(usageLimit) : null,
    });

    return res.status(201).json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully!',
    });
  } catch (error: any) {
    console.error('[Coupon Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create coupon.',
    });
  }
};

/**
 * @desc    Toggle coupon active status (Admin)
 * @route   PATCH /api/coupons/:id/toggle
 * @access  Private/Admin
 */
export const toggleCouponStatus = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found.',
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.status(200).json({
      success: true,
      data: coupon,
      message: `Coupon status updated to ${coupon.isActive ? 'Active' : 'Inactive'}.`,
    });
  } catch (error) {
    console.error('[Coupon Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update coupon status.',
    });
  }
};

/**
 * @desc    Delete coupon (Admin)
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully.',
    });
  } catch (error) {
    console.error('[Coupon Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete coupon.',
    });
  }
};
