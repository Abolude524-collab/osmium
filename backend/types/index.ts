import { Types } from 'mongoose';

export type UserRole = 'customer' | 'admin';

export interface IUser {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  wishlist?: Types.ObjectId[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductStatus = 'active' | 'draft' | 'archived' | 'out_of_stock';

export interface IProduct {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category?: Types.ObjectId | ICategory | string;
  subcategory?: string;
  brand?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  tags?: string[];
  featured: boolean;
  status: ProductStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrderItem {
  _id?: Types.ObjectId | string;
  product: Types.ObjectId | IProduct | string;
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  streetAddress?: string;
  street?: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IPaymentInfo {
  status: PaymentStatus;
  method: string;
  stripePaymentIntentId?: string; // Stores Paystack reference string
  paidAt?: Date;
}

export interface IOrder {
  _id: Types.ObjectId | string;
  orderNumber: string;
  user: Types.ObjectId | IUser | string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentInfo: IPaymentInfo;
  fulfillmentStatus: FulfillmentStatus;
  subtotal: number;
  tax: number;
  shippingPrice: number;
  totalAmount: number;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DiscountType = 'percentage' | 'flat';

export interface ICoupon {
  _id: Types.ObjectId | string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number | null;
  expirationDate: Date;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  _id: Types.ObjectId | string;
  user: Types.ObjectId | IUser | string;
  product: Types.ObjectId | IProduct | string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T = any> {
  status?: string;
  success?: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
  count?: number;
}
