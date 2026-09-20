import mongoose, { Document, Model } from 'mongoose';
import { IProduct } from '../types/index.js';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const productSchema = new mongoose.Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'Product SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true,
    },
    subcategory: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived', 'out_of_stock'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  subcategory: 'text',
  tags: 'text',
});

productSchema.index({ category: 1, status: 1, price: 1 });

export const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', productSchema);
