import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { registerSchema, loginSchema, validateAuthInput } from '../validators/authValidator.js';
import { AuthRequest } from '../middleware/authHandler.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new customer account
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isValid, errors, data } = validateAuthInput(registerSchema, req.body);
    
    if (!isValid || !data) {
      res.status(422);
      return res.json({
        status: 'fail',
        message: 'Validation failed',
        errors,
      });
    }

    const { name, email, password } = data;

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      return next(new Error('An account with this email address already exists'));
    }

    // Create user (role defaults to 'customer')
    const user = await User.create({
      name,
      email,
      password,
      role: 'customer',
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isValid, errors, data } = validateAuthInput(loginSchema, req.body);

    if (!isValid || !data) {
      res.status(422);
      return res.json({
        status: 'fail',
        message: 'Validation failed',
        errors,
      });
    }

    const { email, password } = data;

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    if (!user.isActive) {
      res.status(403);
      return next(new Error('Account disabled — Please contact support'));
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user profile
 * @access  Private (Protected)
 */
export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user & clear session
 * @access  Public
 */
export const logoutUser = async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Successfully logged out',
  });
};
