import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { createProductSchema, updateProductSchema, validateProductInput } from '../validators/productValidator.js';

/**
 * @route   GET /api/products
 * @desc    Get all products with server-side search, filtering, sorting, and pagination
 * @access  Public
 */
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      category,
      subcategory,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = { status: 'active' };

    // 1. Full-Text Search
    if (search && typeof search === 'string') {
      query.$text = { $search: search };
    }

    // 2. Category Filter (Supports category ID or slug string)
    if (category && typeof category === 'string') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // If category slug doesn't exist, return empty results
          return res.status(200).json({
            status: 'success',
            results: 0,
            pagination: { page: Number(page), limit: Number(limit), totalPages: 0, totalProducts: 0 },
            data: { products: [] },
          });
        }
      }
    }

    // 3. Subcategory Filter
    if (subcategory && typeof subcategory === 'string') {
      query.subcategory = new RegExp(`^${subcategory}$`, 'i');
    }

    // 4. Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 5. Rating Filter
    if (rating) {
      query['ratings.average'] = { $gte: Number(rating) };
    }

    // 6. Stock Availability Filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // 7. Sorting Options
    let sortOption: any = { createdAt: -1 }; // Default: newest first

    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating_desc') {
      sortOption = { 'ratings.average': -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    // 8. Server-Side Pagination Calculation
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, parseInt(limit as string, 10));
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Get single product by SEO slug
 * @access  Public
 */
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: 'active' }).populate(
      'category',
      'name slug'
    );

    if (!product) {
      res.status(404);
      return next(new Error(`Product not found with slug '${req.params.slug}'`));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by MongoDB ID
 * @access  Public
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product) {
      res.status(404);
      return next(new Error(`Product not found with ID '${req.params.id}'`));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin Only)
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isValid, errors, data } = validateProductInput(createProductSchema, req.body);

    if (!isValid || !data) {
      res.status(422);
      return res.json({
        status: 'fail',
        message: 'Validation failed',
        errors,
      });
    }

    // Auto-generate slug if omitted
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Check duplicate SKU or Slug
    const existingProduct = await Product.findOne({
      $or: [{ sku: data.sku.toUpperCase() }, { slug: data.slug }],
    });

    if (existingProduct) {
      res.status(409);
      return next(new Error('A product with this SKU or slug already exists'));
    }

    const product = await Product.create(data);

    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/products/:id
 * @desc    Update product by ID
 * @access  Private (Admin Only)
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isValid, errors, data } = validateProductInput(updateProductSchema, req.body);

    if (!isValid || !data) {
      res.status(422);
      return res.json({
        status: 'fail',
        message: 'Validation failed',
        errors,
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404);
      return next(new Error(`Product not found with ID '${req.params.id}'`));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete or Archive product by ID
 * @access  Private (Admin Only)
 */
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      return next(new Error(`Product not found with ID '${req.params.id}'`));
    }

    await product.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Product successfully deleted',
    });
  } catch (error) {
    next(error);
  }
};
