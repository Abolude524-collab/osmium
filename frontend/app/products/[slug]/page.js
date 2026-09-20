'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductBySlug } from '@/services/productService';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Toast } from '@/components/ui/Toast';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RotateCcw, MessageSquare, Star, Heart } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  // Reviews State
  const [reviewsData, setReviewsData] = useState({ reviews: [], summary: {} });

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { token } = useAuthStore();

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchProductBySlug(slug);
    setProduct(data);
    setIsLoading(false);
  }, [slug]);

  const loadReviews = useCallback(async (productId) => {
    if (!productId) return;
    try {
      const res = await fetch(`${API_URL}/products/${productId}/reviews`);
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setReviewsData(data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug, loadProduct]);

  useEffect(() => {
    if (product && product._id) {
      loadReviews(product._id);
    }
  }, [product, loadReviews]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setToastMessage(`Added ${quantity} × ${product.name} to your cart`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8">
        <Skeleton className="w-full h-96 rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full mt-4" />
          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <h1 className="text-2xl font-bold text-primary">Product Not Found</h1>
        <p className="text-sm text-secondary">
          The requested product slug '{slug}' could not be located in the OSMIUM catalog.
        </p>
        <Link href="/products">
          <Button variant="secondary" icon={ArrowLeft}>
            RETURN TO CATALOG
          </Button>
        </Link>
      </div>
    );
  }

  const attributesEntries = product.attributes
    ? Object.entries(product.attributes)
    : [];

  return (
    <div className="flex flex-col gap-12 py-4">

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-secondary">
        <Link href="/products" className="hover:text-cyan transition-colors">CATALOG</Link>
        <span>/</span>
        <span className="text-cyan uppercase">{product.category?.name || 'PRODUCT'}</span>
        <span>/</span>
        <span className="text-primary truncate max-w-xs">{product.name}</span>
      </div>

      {/* Product View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="w-full h-[400px] sm:h-[480px] rounded-lg border border-border bg-graphite overflow-hidden relative">
            {product.images && product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-secondary/30 font-mono">
                [ NO IMAGE AVAILABLE ]
              </div>
            )}
          </div>

          {/* Thumbnail Selector */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded border overflow-hidden shrink-0 transition-all ${
                    selectedImage === idx ? 'border-cyan shadow-cyan/20 shadow-md' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Meta & Purchase Panel */}
        <div className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan tracking-widest uppercase">
                {product.brand || 'OSMIUM'} • {product.subcategory || product.category?.name}
              </span>
              <Badge variant={product.stock > 0 ? 'success' : 'error'} dot>
                {product.stock > 0 ? `IN STOCK (${product.stock})` : 'OUT OF STOCK'}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-secondary">SKU: {product.sku}</span>
              {reviewsData.summary?.averageRating > 0 && (
                <div className="flex items-center gap-1 text-warning">
                  <Star className="w-4 h-4 fill-warning" />
                  <span className="font-bold text-primary">{reviewsData.summary.averageRating.toFixed(1)}</span>
                  <span className="text-secondary">({reviewsData.summary.totalReviews})</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 py-2 border-y border-border">
            <span className="text-3xl font-bold font-mono text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm font-mono text-secondary line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-secondary leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Quantity Selector & Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <div className="inline-flex items-center justify-between border border-border rounded-md bg-obsidian px-3 py-2.5 w-32 font-mono text-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-secondary hover:text-cyan px-2"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-primary font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-secondary hover:text-cyan px-2"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={ShoppingBag}
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
              className="flex-1"
            >
              ADD TO CART • {formatCurrency(product.price * quantity)}
            </Button>

            <button
              onClick={() => toggleWishlist(product, token)}
              className={`p-3 rounded-lg border border-border transition-colors flex items-center justify-center ${
                isInWishlist(product._id)
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-500'
                  : 'bg-obsidian text-secondary hover:text-cyan hover:border-cyan/40'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Trust Value Props */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border text-[11px] font-mono text-secondary">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-cyan shrink-0" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success shrink-0" />
              <span>Authentic Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-warning shrink-0" />
              <span>30-Day Returns</span>
            </div>
          </div>

          {/* Attributes Table */}
          {attributesEntries.length > 0 && (
            <Card elevated className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase font-mono">SPECIFICATIONS & ATTRIBUTES</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-col divide-y divide-border/50 text-xs font-sans">
                  {attributesEntries.map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2">
                      <span className="font-mono text-secondary uppercase tracking-wider">{key}</span>
                      <span className="font-medium text-primary text-right">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Customer Reviews & Form Section */}
      <div className="flex flex-col gap-8 pt-8 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary tracking-tight">Customer Reviews & Ratings</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ReviewList reviews={reviewsData.reviews} summary={reviewsData.summary} />
          </div>
          <div>
            <ReviewForm
              productId={product._id}
              onReviewSubmitted={() => {
                loadReviews(product._id);
                loadProduct();
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            type="success"
            title="Cart Updated"
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

      {/* JSON-LD Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.images && product.images[0] ? [product.images[0]] : [],
            description: product.description,
            sku: product.sku,
            brand: {
              '@type': 'Brand',
              name: product.brand || 'OSMIUM',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'NGN',
              price: product.price,
              itemCondition: 'https://schema.org/NewCondition',
              availability:
                product.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
            },
            aggregateRating:
              reviewsData.summary?.averageRating > 0
                ? {
                    '@type': 'AggregateRating',
                    ratingValue: reviewsData.summary.averageRating,
                    reviewCount: reviewsData.summary.totalReviews || 1,
                  }
                : undefined,
          }),
        }}
      />
    </div>
  );
}
