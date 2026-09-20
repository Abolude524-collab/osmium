'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Package, ArrowRight, Printer, MapPin, Calendar, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const isMock = searchParams.get('mock') === 'true';

  const { clearCart } = useCartStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setError('No transaction reference found in URL.');
      return;
    }

    const verifyTransaction = async () => {
      try {
        const url = `${API_URL}/checkout/verify/${reference}${isMock ? '?mock=true' : ''}`;
        const res = await fetch(url);
        const data = await res.json();

        if (res.ok && data.status === 'success') {
          setOrder(data.data.order);
          // Authoritative payment confirmed — clear cart store
          clearCart();
        } else {
          setError(data.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Failed to connect to order verification service.');
      } finally {
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [reference, isMock, clearCart]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-2xl mx-auto py-12">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-full h-48 rounded-lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center max-w-md mx-auto py-12">
        <div className="w-16 h-16 rounded-full bg-error/10 border border-error/30 flex items-center justify-center text-error">
          !
        </div>
        <h1 className="text-2xl font-bold text-primary">Payment Verification Issue</h1>
        <p className="text-sm text-secondary">{error || 'Could not find order details.'}</p>
        <Link href="/products">
          <Button variant="primary" icon={ArrowRight}>CONTINUE SHOPPING</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto py-8 gap-8">
      
      {/* Top Banner Success Card */}
      <div className="w-full flex flex-col items-center text-center gap-3 p-8 rounded border border-success/30 bg-success/5">
        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/40 flex items-center justify-center text-success">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-mono tracking-widest text-success uppercase">PAYMENT CONFIRMED VIA PAYSTACK</span>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Order #{order.orderNumber}</h1>
        <p className="text-sm text-secondary max-w-md">
          Thank you for your order! Your payment has been authorized and your order is currently being prepared for shipping.
        </p>
      </div>

      {/* Main Order Receipt Card */}
      <Card elevated className="w-full">
        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-cyan" />
            <CardTitle className="text-lg font-bold">Official Order Receipt</CardTitle>
          </div>
          <Badge variant="success" size="md">PAID</Badge>
        </CardHeader>

        <CardContent className="pt-6 flex flex-col gap-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded bg-obsidian border border-border text-xs font-mono">
            <div className="flex flex-col gap-1">
              <span className="text-secondary/70">PAYSTACK REFERENCE</span>
              <span className="text-cyan font-bold truncate">{order.paymentInfo?.stripePaymentIntentId || reference}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-secondary/70">DATE & TIME</span>
              <span className="text-primary font-bold">
                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-secondary/70">FULFILLMENT STATUS</span>
              <span className="text-success font-bold uppercase">{order.fulfillmentStatus}</span>
            </div>
          </div>

          {/* Items Purchased Table */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-secondary uppercase tracking-wider">PURCHASED ITEMS</span>
            <div className="flex flex-col divide-y divide-border/60 border border-border rounded overflow-hidden">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-obsidian/40">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-graphite border border-border overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-secondary">IMG</div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">{item.name}</span>
                      <span className="text-xs font-mono text-secondary">SKU: {item.sku || 'OSM-PROD'}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs text-secondary">{item.quantity} x {formatCurrency(item.price)}</div>
                    <div className="text-sm font-bold text-primary">{formatCurrency(item.quantity * item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Delivery Address */}
            <div className="flex flex-col gap-2 p-4 rounded bg-obsidian border border-border">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan uppercase font-bold">
                <MapPin className="w-4 h-4" /> SHIPPING ADDRESS
              </div>
              <div className="text-xs text-secondary leading-relaxed font-mono mt-1">
                <div className="text-primary font-bold">{order.shippingAddress?.fullName}</div>
                <div>{order.shippingAddress?.streetAddress}</div>
                <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</div>
                <div>{order.shippingAddress?.country}</div>
                <div className="mt-1 text-secondary/70">Phone: {order.shippingAddress?.phone}</div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col gap-2 p-4 rounded bg-obsidian border border-border text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-secondary">Subtotal</span>
                <span className="text-primary">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-secondary">Estimated Tax</span>
                <span className="text-primary">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-secondary">Shipping Fee</span>
                <span className="text-primary">
                  {order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold">
                <span className="text-primary">TOTAL PAID</span>
                <span className="text-cyan text-base">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

          </div>

          {/* Action Footer Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-cyan"
            >
              <Printer className="w-4 h-4" /> PRINT RECEIPT
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/orders" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full">
                  VIEW MY ORDERS
                </Button>
              </Link>
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="primary" size="md" icon={ShoppingBag} className="w-full">
                  CONTINUE SHOPPING
                </Button>
              </Link>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 text-cyan animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
