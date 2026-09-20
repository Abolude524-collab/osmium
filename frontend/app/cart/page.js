'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getItemCount } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const estimatedTax = subtotal * 0.08; // 8% estimated tax display
  const estimatedShipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const estimatedTotal = subtotal + estimatedTax + estimatedShipping;

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <span className="text-xs font-mono tracking-widest text-cyan uppercase">CHECKOUT PREPARATION</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">Your Shopping Cart</h1>
        <p className="text-sm text-secondary">
          Review your items, update quantities, and proceed to secure checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping cart is empty"
          description="You haven't added any products to your cart yet. Explore our curated catalog."
          actionLabel="EXPLORE PRODUCTS"
          onAction={() => window.location.href = '/products'}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Item List Table */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-mono text-secondary">
              <span>PRODUCT ({itemCount} ITEMS)</span>
              <button
                onClick={clearCart}
                className="text-error hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> CLEAR CART
              </button>
            </div>

            <div className="flex flex-col divide-y divide-border/60">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Item Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-20 h-20 rounded bg-graphite border border-border overflow-hidden shrink-0">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-secondary/30">NO IMG</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[10px] font-mono text-cyan uppercase">{product.category?.name || 'CATALOG'}</span>
                      <Link href={`/products/${product.slug}`} className="text-sm font-bold text-primary hover:text-cyan truncate">
                        {product.name}
                      </Link>
                      <span className="text-xs font-mono text-secondary">SKU: {product.sku}</span>
                      <span className="text-xs font-mono text-secondary">Price: {formatCurrency(product.price)}</span>
                    </div>
                  </div>

                  {/* Quantity & Item Total */}
                  <div className="flex items-center gap-6 self-end sm:self-center">
                    <div className="inline-flex items-center border border-border rounded bg-obsidian text-xs font-mono">
                      <button
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        className="px-2.5 py-1 text-secondary hover:text-cyan"
                      >
                        -
                      </button>
                      <span className="px-3 text-primary font-bold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        className="px-2.5 py-1 text-secondary hover:text-cyan"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-base font-bold font-mono text-primary w-24 text-right">
                      {formatCurrency(product.price * quantity)}
                    </span>

                    <button
                      onClick={() => removeItem(product._id)}
                      className="text-secondary hover:text-error p-1 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <Link href="/products" className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-cyan">
                <ArrowLeft className="w-3.5 h-3.5" /> CONTINUE SHOPPING
              </Link>
            </div>
          </div>

          {/* Right Column: Authoritative Order Summary */}
          <div className="flex flex-col gap-4">
            <Card elevated>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold uppercase tracking-wider font-mono">ORDER SUMMARY</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4">
                
                <div className="flex flex-col gap-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-secondary">Subtotal</span>
                    <span className="text-primary font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Estimated Tax (8%)</span>
                    <span className="text-primary font-semibold">{formatCurrency(estimatedTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Shipping</span>
                    <span className="text-primary font-semibold">
                      {estimatedShipping === 0 ? 'FREE' : formatCurrency(estimatedShipping)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-baseline font-mono">
                  <span className="text-sm font-bold text-primary">ESTIMATED TOTAL</span>
                  <span className="text-xl font-extrabold text-cyan">{formatCurrency(estimatedTotal)}</span>
                </div>

                <p className="text-[10px] text-secondary/70 leading-relaxed font-mono">
                  * Note: Cart totals are client estimates. Final authoritative amounts and stock reservations are computed by the server at checkout.
                </p>

                <Link href="/checkout" className="w-full mt-2">
                  <Button variant="primary" size="lg" icon={ArrowRight} className="w-full">
                    PROCEED TO CHECKOUT
                  </Button>
                </Link>

              </CardContent>
            </Card>

            <div className="p-4 rounded border border-border bg-graphite/40 flex flex-col gap-2 text-xs text-secondary font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-primary font-semibold">SECURE CHECKOUT</span>
              </div>
              <p className="text-[11px] text-secondary/70">
                Processed via Paystack 256-bit SSL encrypted connection.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
