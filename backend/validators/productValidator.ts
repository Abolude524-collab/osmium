import { z, ZodSchema } from 'zod';

/**
 * Zod validation schema for Product Creation
 */
export const createProductSchema = z.object({
  name: z.string().trim().min(3, 'Product name must be at least 3 characters long'),
  slug: z.string().trim().min(3, 'Slug must be at least 3 characters long').optional(),
  sku: z.string().trim().min(3, 'SKU must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  shortDescription: z.string().optional(),
  price: z.number().min(0, 'Price cannot be negative'),
  compareAtPrice: z.number().min(0).optional().nullable(),
  category: z.string().min(1, 'Category ID is required'),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  stock: z.number().int().min(0, 'Stock quantity cannot be negative'),
  images: z.array(z.string().min(1, 'Product image path or URL is required')).min(1, 'At least one product image is required'),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'archived', 'draft']).optional(),
  attributes: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Zod validation schema for Product Update
 */
export const updateProductSchema = createProductSchema.partial();

/**
 * Helper to format Zod error issues into a clean object
 */
export const validateProductInput = <T>(schema: ZodSchema<T>, data: unknown) => {
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
