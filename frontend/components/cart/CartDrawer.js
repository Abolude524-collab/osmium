'use client';

import React from 'react';
import Link from 'next/link';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const CartDrawer = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={closeCartDrawer}
      title="YOUR CART"
      subtitle={`${itemCount} ${itemCount === 1 ? 'ITEM' : 'ITEMS'}`}
      position="right"
    >
      <div className="flex flex-col h-full justify-between gap-4">
        
        {/* Item List */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-auto text-center p-6 gap-3">
            <div className="w-12 h-12 rounded-full bg-elevated border border-border flex items-center justify-center text-secondary">
              <ShoppingBag className="w-6 h-6 text-cyan" />
            </div>
            <h3 className="text-sm font-bold text-primary">Your cart is empty</h3>
            <p className="text-xs text-secondary">Explore our catalog to add products to your cart.</p>
            <Link href="/products" onClick={closeCartDrawer} className="mt-2">
              <Button variant="secondary" size="sm">BROWSE PRODUCTS</Button>
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-border/60 pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="py-4 flex gap-3 items-center">
                
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded bg-obsidian border border-border overflow-hidden shrink-0">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-secondary/30">
                      NO IMG
                    </div>
                  )}
                </div>

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={closeCartDrawer}
                    className="text-xs font-medium text-primary hover:text-cyan truncate"
                  >
                    {product.name}
                  </Link>
                  <span className="text-[10px] font-mono text-secondary">SKU: {product.sku}</span>
                  <span className="text-xs font-mono font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="inline-flex items-center border border-border rounded bg-obsidian text-xs font-mono">
                      <button
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        className="px-2 py-0.5 text-secondary hover:text-cyan"
                      >
                        -
                      </button>
                      <span className="px-2 text-primary font-bold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        className="px-2 py-0.5 text-secondary hover:text-cyan"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(product._id)}
                      className="text-secondary hover:text-error p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-secondary uppercase">SUBTOTAL</span>
              <span className="text-base font-bold text-primary">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-[10px] text-secondary/70">
              Shipping & taxes calculated authoritative on server at checkout.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <Link href="/cart" onClick={closeCartDrawer}>
                <Button variant="secondary" size="md" className="w-full">
                  VIEW CART
                </Button>
              </Link>
              <Link href="/checkout" onClick={closeCartDrawer}>
                <Button variant="primary" size="md" icon={ArrowRight} className="w-full">
                  CHECKOUT
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </Drawer>
  );
};
