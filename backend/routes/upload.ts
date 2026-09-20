import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect, requireAdmin } from '../middleware/authHandler.js';

const router = express.Router();

router.post('/', protect, requireAdmin, uploadImage);

export default router;
