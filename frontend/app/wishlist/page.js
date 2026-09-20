'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';

export default function WishlistPage() {
  const { items, toggleWishlist, fetchServerWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (token) {
      fetchServerWishlist(token);
    }
  }, [token]);

  if (!mounted) return null;

  const handleMoveToCart = (product) => {
    addItemToCart(product, 1);
    toggleWishlist(product, token);
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#1E293B]">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
                <Heart className="w-5 h-5 fill-[#00E5FF]" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight font-heading">
                MY WISHLIST & SAVED ITEMS
              </h1>
            </div>
            <p className="text-sm text-[#8B949E] mt-1 font-mono">
              Keep track of products you're interested in purchasing later.
            </p>
          </div>

          <Link
            href="/products"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[#1E293B] bg-[#111820] text-[#E6EDF3] hover:border-[#00E5FF]/40 transition-colors flex items-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 text-[#00E5FF]" />
          </Link>
        </div>

        {/* Wishlist Grid */}
        {items.length === 0 ? (
          <div className="bg-[#111820] border border-[#1E293B] rounded-2xl py-20 px-4 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#17212B] border border-[#1E293B] flex items-center justify-center mx-auto text-[#8B949E]">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#E6EDF3]">Your Wishlist is Empty</h2>
            <p className="text-sm text-[#8B949E]">
              Save products to your wishlist while browsing so you can easily review or purchase them anytime.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-[#00E5FF] text-[#0B0F14] hover:bg-[#00B8D4] transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)]"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => {
              if (!product || typeof product !== 'object') return null;
              const imageSrc = product.images && product.images[0] ? product.images[0] : '/placeholder.jpg';
              
              return (
                <div
                  key={product._id}
                  className="bg-[#111820] border border-[#1E293B] hover:border-[#00E5FF]/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square bg-[#17212B] overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={product.name || 'Product'}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleWishlist(product, token)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[#0B0F14]/80 backdrop-blur-md border border-[#1E293B] text-rose-500 hover:bg-rose-500/20 transition-all"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {product.brand && (
                      <span className="absolute bottom-3 left-3 text-[10px] font-mono uppercase bg-[#0B0F14]/80 text-[#00E5FF] px-2.5 py-1 rounded-md border border-[#00E5FF]/20 backdrop-blur-md">
                        {product.brand}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-bold text-[#E6EDF3] hover:text-[#00E5FF] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mt-2 font-mono">
                        <span className="text-lg font-extrabold text-[#00E5FF]">
                          ₦{product.price?.toLocaleString()}
                        </span>
                        {product.compareAtPrice > product.price && (
                          <span className="text-xs text-[#8B949E] line-through">
                            ₦{product.compareAtPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1E293B] flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#00E5FF] hover:text-[#0B0F14] transition-all"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Move to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
