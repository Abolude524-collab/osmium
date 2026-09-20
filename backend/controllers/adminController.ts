import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';

/**
 * @route   GET /api/admin/metrics
 * @desc    Get dashboard metrics, revenue, low-stock alerts, and recent stats
 * @access  Private (Admin Only)
 */
export const getAdminMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('name sku stock category price images');
    
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalOrders = await Order.countDocuments();

    // Calculate Total Revenue from paid, non-cancelled orders
    const revenueStats = await Order.aggregate([
      {
        $match: {
          'paymentInfo.status': 'paid',
          fulfillmentStatus: { $ne: 'cancelled' },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // Fetch recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.status(200).json({
      status: 'success',
      data: {
        metrics: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          activeProducts,
          lowStockCount: lowStockProducts.length,
        },
        lowStockProducts,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/customers
 * @desc    Get all customer accounts for admin management
 * @access  Private (Admin Only)
 */
export const getAdminCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: customers.length,
      data: {
        customers,
      },
    });
  } catch (error) {
    next(error);
  }
};
