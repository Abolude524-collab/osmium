import express from 'express';
import { getWishlist, toggleWishlistItem } from '../controllers/wishlistController.js';
import { protect } from '../middleware/authHandler.js';

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/toggle/:productId', protect, toggleWishlistItem);

export default router;
