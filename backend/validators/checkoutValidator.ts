import { z } from 'zod';

/**
 * Zod validation schema for Cart Validation (totals calculation)
 */
export const cartValidationSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'Cart items array cannot be empty'),
  shippingOption: z.enum(['standard', 'express']).optional().default('standard'),
});

/**
 * Zod validation schema for Checkout Initializing Payment & Pending Order Creation
 */
export const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().trim().min(2, 'Full name is required'),
    streetAddress: z.string().trim().optional(),
    street: z.string().trim().optional(),
    apartment: z.string().optional(),
    city: z.string().trim().min(2, 'City is required'),
    state: z.string().trim().min(2, 'State / Province is required'),
    postalCode: z.string().trim().min(3, 'Postal / ZIP code is required'),
    country: z.string().trim().min(2, 'Country is required'),
    phone: z.string().trim().min(7, 'Valid phone number is required'),
  }).refine((val) => !!(val.streetAddress || val.street), {
    message: 'Street address is required',
    path: ['streetAddress'],
  }),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'Cart items array cannot be empty'),
  shippingOption: z.enum(['standard', 'express']).optional().default('standard'),
});

export const validateCartInput = (data: unknown) => {
  const result = cartValidationSchema.safeParse(data);
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

export const validateCheckoutInput = (data: unknown) => {
  const result = checkoutSchema.safeParse(data);
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
