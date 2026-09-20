import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order.js';

/**
 * @route   GET /api/admin/analytics
 * @desc    Get detailed admin analytics, revenue trends, top products & category performance
 * @access  Private (Admin Only)
 */
export const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Overall Revenue & Orders
    const paidOrders = await Order.find({
      'paymentInfo.status': 'paid',
      fulfillmentStatus: { $ne: 'cancelled' },
    });

    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = await Order.countDocuments();

    // 2. Fulfillment Status Distribution
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$fulfillmentStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const fulfillmentDistribution: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    statusCounts.forEach((item) => {
      if (fulfillmentDistribution[item._id] !== undefined) {
        fulfillmentDistribution[item._id] = item.count;
      }
    });

    // 3. Top Selling Products (by total quantity sold in paid orders)
    const topProductsRaw = await Order.aggregate([
      { $match: { 'paymentInfo.status': 'paid', fulfillmentStatus: { $ne: 'cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          sku: { $first: '$orderItems.sku' },
          image: { $first: '$orderItems.image' },
          totalUnitsSold: { $sum: '$orderItems.quantity' },
          totalRevenueGenerated: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
      { $sort: { totalUnitsSold: -1 } },
      { $limit: 5 },
    ]);

    // 4. Category Revenue Distribution
    const categoryRevenueRaw = await Order.aggregate([
      { $match: { 'paymentInfo.status': 'paid', fulfillmentStatus: { $ne: 'cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'productDetails.category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$categoryDetails.name',
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
          itemsSold: { $sum: '$orderItems.quantity' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    const categoryBreakdown = categoryRevenueRaw.map((item) => ({
      categoryName: item._id || 'General Catalog',
      revenue: Math.round(item.revenue * 100) / 100,
      itemsSold: item.itemsSold,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders,
          fulfillmentDistribution,
        },
        topSellingProducts: topProductsRaw,
        categoryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
