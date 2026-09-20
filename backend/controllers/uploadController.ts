import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

/**
 * @route   POST /api/upload
 * @desc    Upload product image (Base64 or external URL) and store locally
 * @access  Private (Admin Only)
 */
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image, fileName } = req.body;

    if (!image || typeof image !== 'string') {
      res.status(400);
      return next(new Error('Please provide image data (Base64 string or URL)'));
    }

    // If already a full HTTP/HTTPS URL string, return as-is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return res.status(200).json({
        status: 'success',
        data: { url: image },
      });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Process Base64 image
    const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) {
      return res.status(200).json({
        status: 'success',
        data: { url: image },
      });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanFileName = (fileName || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 30);
    const uniqueName = `${cleanFileName}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${uniqueName}`;

    res.status(201).json({
      status: 'success',
      data: {
        url: relativeUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
