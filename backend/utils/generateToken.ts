import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT for an authenticated user
 * @param userId - Mongo user ID
 * @param role - User authorization role ('customer' | 'admin')
 * @returns JWT Token string
 */
export const generateToken = (userId: string, role: string = 'customer'): string => {
  const secret = process.env.JWT_SECRET || 'osmium_dev_jwt_secret_min32chars_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: userId,
      role: role,
    },
    secret,
    {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    }
  );
};
