import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/authHandler.js';

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get current logged-in customer's order history
 * @access  Private / Protected
 */
export const getUserOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get detailed order receipt by ID or Order Number
 * @access  Private / Protected
 */
export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Search by ObjectId or orderNumber string
    let order: any;
    if (typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) {
      order = await Order.findById(id).populate('user', 'name email');
    } else {
      order = await Order.findOne({ orderNumber: id }).populate('user', 'name email');
    }

    if (!order) {
      res.status(404);
      return next(new Error(`Order not found with ID or Number '${id}'`));
    }

    // Auth check: Must be order owner or admin
    if (order.user._id.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403);
      return next(new Error('Forbidden — You do not have permission to view this order receipt'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get all system orders (Admin)
 * @access  Private / Admin
 */
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (req.query.status) {
      query.fulfillmentStatus = req.query.status;
    }

    if (req.query.paymentStatus) {
      query['paymentInfo.status'] = req.query.paymentStatus;
    }

    if (req.query.search) {
      query.orderNumber = { $regex: req.query.search, $options: 'i' };
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
        pagination: {
          total: totalOrders,
          page,
          pages: Math.ceil(totalOrders / limit),
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order fulfillment status (Admin)
 * @access  Private / Admin
 */
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      return next(new Error(`Invalid fulfillment status. Allowed: ${validStatuses.join(', ')}`));
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      return next(new Error(`Order not found with ID '${id}'`));
    }

    const previousStatus = order.fulfillmentStatus;
    order.fulfillmentStatus = status;

    if (status === 'delivered') {
      order.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      order.paymentInfo.status = 'refunded';
      // Restore inventory stock if cancelled
      if (previousStatus !== 'cancelled') {
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
      }
    }

    await order.save();

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};
