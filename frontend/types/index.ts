export type UserRole = 'customer' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  wishlist?: (string | IProduct)[];
  createdAt?: string;
  updatedAt?: string;
}

export type ProductStatus = 'active' | 'draft' | 'archived' | 'out_of_stock';

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category?: ICategory | string;
  subcategory?: string;
  brand?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  tags?: string[];
  featured: boolean;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: IProduct;
  quantity: number;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrderItem {
  _id?: string;
  product: string | IProduct;
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
  stripePaymentIntentId?: string;
  paidAt?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: IUser | string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentInfo: IPaymentInfo;
  fulfillmentStatus: FulfillmentStatus;
  subtotal: number;
  tax: number;
  shippingPrice: number;
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export type DiscountType = 'percentage' | 'flat';

export interface ICoupon {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number | null;
  expirationDate: string;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReview {
  _id: string;
  user: IUser | { _id: string; name: string; avatar?: string };
  product: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  status?: string;
  success?: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
  count?: number;
}
