import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import adminRoutes from './routes/admin.js';
import analyticsRoutes from './routes/analytics.js';
import checkoutRoutes from './routes/checkout.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import couponRoutes from './routes/coupons.js';
import wishlistRoutes from './routes/wishlist.js';
import uploadRoutes from './routes/upload.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB();
  const paystackKey = process.env.PAYSTACK_SECRET_KEY;
  if (paystackKey && !paystackKey.includes('your_paystack_secret_key')) {
    console.log(`[Paystack Gateway] ✅ ACTIVE - Secret Key Loaded (${paystackKey.slice(0, 12)}...)`);
  } else {
    console.log('[Paystack Gateway] ⚠️ DEV MOCK MODE - Add PAYSTACK_SECRET_KEY to .env.local for live gateway');
  }
}

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const checkoutLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Rate limit exceeded for payment checkout requests.' },
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/checkout', checkoutLimiter, checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[OSMIUM API] Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export default app;
