import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Coupon } from '../models/Coupon.js';
import { validateCartInput, validateCheckoutInput } from '../validators/checkoutValidator.js';
import { AuthRequest } from '../middleware/authHandler.js';

export interface AuthoritativeTotalsResult {
  subtotal: number;
  tax: number;
  shippingPrice: number;
  discountAmount: number;
  appliedCoupon: any | null;
  totalAmount: number;
  validatedItems: Array<{
    product: any;
    name: string;
    sku: string;
    image: string;
    price: number;
    quantity: number;
  }>;
}

export const calculateAuthoritativeTotals = async (
  items: Array<{ productId: string; quantity: number }>,
  shippingOption: string = 'standard',
  couponCode: string | null = null
): Promise<AuthoritativeTotalsResult> => {
  let subtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found (ID: ${item.productId})`);
    }

    if (product.status !== 'active') {
      throw new Error(`Product '${product.name}' is no longer active for purchase`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Requested quantity for '${product.name}' exceeds available stock (${product.stock} left)`);
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    validatedItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      image: product.images && product.images[0] ? product.images[0] : '',
      price: product.price,
      quantity: item.quantity,
    });
  }

  let discountAmount = 0;
  let appliedCoupon = null;

  if (couponCode && typeof couponCode === 'string') {
    const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });
    if (coupon) {
      const validation = coupon.isValid(subtotal);
      if (validation.valid) {
        discountAmount = coupon.calculateDiscount(subtotal);
        appliedCoupon = coupon;
      }
    }
  }

  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shippingPrice = shippingOption === 'express' ? 25 : subtotal > 150 ? 0 : 15;
  const rawTotal = subtotal + tax + shippingPrice - discountAmount;
  const totalAmount = Math.max(0, Math.round(rawTotal * 100) / 100);

  return {
    subtotal,
    tax,
    shippingPrice,
    discountAmount,
    appliedCoupon,
    totalAmount,
    validatedItems,
  };
};

export const validateCheckoutCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isValid, errors, data } = validateCartInput(req.body);
    if (!isValid || !data) {
      res.status(422);
      return res.json({ status: 'fail', message: 'Validation failed', errors });
    }

    const couponCode = req.body.couponCode || null;
    const calculated = await calculateAuthoritativeTotals(data.items, data.shippingOption, couponCode);

    res.status(200).json({
      status: 'success',
      data: {
        subtotal: calculated.subtotal,
        tax: calculated.tax,
        shippingPrice: calculated.shippingPrice,
        discountAmount: calculated.discountAmount,
        appliedCouponCode: calculated.appliedCoupon ? calculated.appliedCoupon.code : null,
        totalAmount: calculated.totalAmount,
        itemCount: calculated.validatedItems.reduce((acc, i) => acc + i.quantity, 0),
      },
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

export const initializePaystackCheckout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { isValid, errors, data } = validateCheckoutInput(req.body);
    if (!isValid || !data) {
      res.status(422);
      return res.json({ status: 'fail', message: 'Validation failed', errors });
    }

    const user = req.user!;
    const couponCode = req.body.couponCode || null;
    const calculated = await calculateAuthoritativeTotals(data.items, data.shippingOption, couponCode);

    if (calculated.appliedCoupon) {
      calculated.appliedCoupon.usageCount = (calculated.appliedCoupon.usageCount || 0) + 1;
      await calculated.appliedCoupon.save();
    }

    const timestamp = Date.now();
    const orderNumber = `OSM-${timestamp.toString().slice(-6)}`;
    const reference = `OSM-PAY-${timestamp}`;

    const amountInSubunits = Math.round(calculated.totalAmount * 100);
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const callbackUrl = `${clientUrl}/orders/success?reference=${reference}`;

    let authorizationUrl = '';

    if (paystackSecret && !paystackSecret.includes('your_paystack_secret_key')) {
      const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          amount: amountInSubunits,
          reference: reference,
          callback_url: callbackUrl,
          metadata: {
            orderNumber: orderNumber,
            userId: user._id.toString(),
            shippingAddress: data.shippingAddress,
          },
        }),
      });

      const paystackData: any = await paystackRes.json();

      if (!paystackRes.ok || !paystackData.status) {
        throw new Error(paystackData.message || 'Failed to initialize Paystack payment transaction');
      }

      authorizationUrl = paystackData.data.authorization_url;
    } else {
      console.warn('[Paystack Warning] PAYSTACK_SECRET_KEY not set. Using local development callback URL.');
      authorizationUrl = `${callbackUrl}&mock=true`;
    }

    const formattedShippingAddress = {
      ...data.shippingAddress,
      streetAddress: data.shippingAddress.streetAddress || data.shippingAddress.street || '',
      street: data.shippingAddress.streetAddress || data.shippingAddress.street || '',
    };

    const order = await Order.create({
      orderNumber: orderNumber,
      user: user._id,
      orderItems: calculated.validatedItems,
      shippingAddress: formattedShippingAddress,
      paymentInfo: {
        status: 'pending',
        method: 'paystack',
        stripePaymentIntentId: reference,
      },
      fulfillmentStatus: 'pending',
      subtotal: calculated.subtotal,
      tax: calculated.tax,
      shippingPrice: calculated.shippingPrice,
      totalAmount: calculated.totalAmount,
    });

    res.status(200).json({
      status: 'success',
      data: {
        authorization_url: authorizationUrl,
        reference: reference,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handlePaystackWebhook = async (req: Request, res: Response) => {
  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY || '';
    const signature = req.headers['x-paystack-signature'] as string;

    if (paystackSecret && signature) {
      const hash = crypto
        .createHmac('sha512', paystackSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash !== signature) {
        console.error('[Paystack Webhook Error] Invalid signature hash');
        return res.status(400).send('Invalid webhook signature');
      }
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const order = await Order.findOne({ 'paymentInfo.stripePaymentIntentId': reference });

      if (order) {
        if (order.paymentInfo.status === 'paid') {
          console.log(`[Paystack Webhook] Order ${order.orderNumber} already marked paid. Skipping.`);
          return res.status(200).json({ status: 'success', message: 'Already processed' });
        }

        order.paymentInfo.status = 'paid';
        order.paymentInfo.paidAt = new Date();
        order.fulfillmentStatus = 'processing';
        await order.save();

        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }

        console.log(`✅ [Paystack Webhook] Successfully processed payment for Order ${order.orderNumber}`);
      }
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('[Paystack Webhook Exception]:', error);
    res.status(500).send('Webhook Processing Error');
  }
};

export const verifyPaystackTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reference } = req.params;
    const isMock = req.query.mock === 'true';

    const order = await Order.findOne({ 'paymentInfo.stripePaymentIntentId': reference }).populate('user', 'name email');

    if (!order) {
      res.status(404);
      return next(new Error(`Order not found with reference '${reference}'`));
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY || '';

    if (paystackSecret && !paystackSecret.includes('your_paystack_secret_key') && order.paymentInfo.status === 'pending') {
      const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      });

      const paystackData: any = await paystackRes.json();

      if (paystackRes.ok && paystackData.status && paystackData.data.status === 'success') {
        order.paymentInfo.status = 'paid';
        order.paymentInfo.paidAt = new Date();
        order.fulfillmentStatus = 'processing';
        await order.save();

        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }
      }
    } else if (isMock && order.paymentInfo.status === 'pending') {
      order.paymentInfo.status = 'paid';
      order.paymentInfo.paidAt = new Date();
      order.fulfillmentStatus = 'processing';
      await order.save();

      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
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
