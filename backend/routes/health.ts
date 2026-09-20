import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Get API system health status and uptime info
 * @access  Public
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    service: 'OSMIUM Backend REST API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

export default router;
