import express from 'express';
import {
  validateCheckoutCart,
  initializePaystackCheckout,
  handlePaystackWebhook,
  verifyPaystackTransaction,
} from '../controllers/checkoutController.js';
import { protect } from '../middleware/authHandler.js';

const router = express.Router();

// Cart Validation & Server Total Calculation
router.post('/validate', validateCheckoutCart);

// Paystack Payment Initialization (Protected)
router.post('/initialize', protect, initializePaystackCheckout);

// Paystack Webhook Event Listener (Public, HMAC Verified)
router.post('/webhook', handlePaystackWebhook);

// Paystack Payment Verification
router.get('/verify/:reference', verifyPaystackTransaction);

export default router;
