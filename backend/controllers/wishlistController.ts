import { Response } from 'express';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/authHandler.js';

/**
 * @desc    Get user wishlist products
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).populate({
      path: 'wishlist',
      select: 'name slug price compareAtPrice images category brand rating stock reviewCount',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    const wishlistItems = user.wishlist || [];

    return res.status(200).json({
      success: true,
      count: wishlistItems.length,
      data: wishlistItems,
    });
  } catch (error) {
    console.error('[Wishlist Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist.',
    });
  }
};

/**
 * @desc    Toggle product in customer's wishlist (Add / Remove)
 * @route   POST /api/wishlist/toggle/:productId
 * @access  Private
 */
export const toggleWishlistItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const user = await User.findById(req.user!._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    // Initialize wishlist array if undefined
    if (!user.wishlist) {
      user.wishlist = [];
    }

    const isWishlisted = user.wishlist.some(
      (id: any) => id.toString() === productId
    );

    if (isWishlisted) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(
        (id: any) => id.toString() !== productId
      ) as any;
    } else {
      // Add to wishlist
      user.wishlist.push(productId as any);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      isWishlisted: !isWishlisted,
      message: !isWishlisted
        ? 'Product added to wishlist'
        : 'Product removed from wishlist',
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error('[Wishlist Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update wishlist.',
    });
  }
};
