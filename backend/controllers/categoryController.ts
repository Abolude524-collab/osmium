import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';

/**
 * @route   GET /api/categories
 * @desc    Get all active product categories
 * @access  Public
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};
