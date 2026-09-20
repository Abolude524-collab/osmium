import { z, ZodSchema } from 'zod';

/**
 * Zod validation schema for User Registration
 */
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

/**
 * Zod validation schema for User Login
 */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Helper to format Zod error issues into a clean object
 */
export const validateAuthInput = <T>(schema: ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const formattedErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      formattedErrors[path] = issue.message;
    });
    return { isValid: false, errors: formattedErrors, data: null };
  }
  return { isValid: true, errors: null, data: result.data };
};
