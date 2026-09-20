'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { Package, Calendar, Clock, ChevronRight, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MyOrdersPage() {
  const { user, token, fetchProfile } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    if (!user && token) {
      fetchProfile();
    }
  }, [user, token, fetchProfile]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.status === 'success') {
          setOrders(data.data.orders);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
        setError('Error connecting to order service.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-primary">Login Required</h1>
        <p className="text-secondary text-sm">Please log in to view your order history and tracking details.</p>
        <Link href="/login?redirect=/orders">
          <Button variant="primary" icon={ArrowRight}>LOG IN TO ACCOUNT</Button>
        </Link>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ALL') return true;
    return o.fulfillmentStatus?.toUpperCase() === activeTab;
  });

  const getStatusBadge = (fulfillmentStatus, paymentStatus) => {
    if (paymentStatus === 'pending') {
      return <Badge variant="warning" size="sm">PAYMENT PENDING</Badge>;
    }
    switch (fulfillmentStatus) {
      case 'delivered':
        return <Badge variant="success" size="sm">DELIVERED</Badge>;
      case 'shipped':
        return <Badge variant="accent" size="sm">SHIPPED</Badge>;
      case 'processing':
        return <Badge variant="default" size="sm">PROCESSING</Badge>;
      case 'cancelled':
        return <Badge variant="error" size="sm">CANCELLED</Badge>;
      default:
        return <Badge variant="default" size="sm">PENDING</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <span className="text-xs font-mono tracking-widest text-cyan uppercase">CUSTOMER DASHBOARD</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">Order History</h1>
        <p className="text-sm text-secondary">
          View past purchases, payment verification status, and fulfillment updates.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-2 text-xs font-mono">
        {['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-cyan/10 border border-cyan/40 text-cyan font-bold'
                : 'text-secondary hover:text-primary hover:bg-graphite'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-24 rounded-lg" />
          <Skeleton className="w-full h-24 rounded-lg" />
          <Skeleton className="w-full h-24 rounded-lg" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description={
            activeTab === 'ALL'
              ? "You haven't placed any orders yet."
              : `No orders matching status '${activeTab}'.`
          }
          actionLabel="EXPLORE CATALOG"
          onAction={() => (window.location.href = '/products')}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <Card key={order._id} elevated className="transition-all hover:border-cyan/40">
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* Order Details Left */}
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold font-mono text-primary">#{order.orderNumber}</span>
                    {getStatusBadge(order.fulfillmentStatus, order.paymentInfo?.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    <span>•</span>

                    <span>{order.orderItems?.length || 0} ITEMS</span>

                    <span>•</span>

                    <span className="text-primary font-bold">
                      TOTAL: {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  {/* Thumbnail Previews */}
                  <div className="flex items-center gap-2 mt-1 overflow-x-auto">
                    {order.orderItems?.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="w-10 h-10 rounded bg-obsidian border border-border overflow-hidden shrink-0" title={item.name}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-secondary">ITEM</div>
                        )}
                      </div>
                    ))}
                    {order.orderItems?.length > 4 && (
                      <span className="text-xs font-mono text-secondary pl-1">+{order.orderItems.length - 4} more</span>
                    )}
                  </div>
                </div>

                {/* Right Action CTA */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <Link href={`/orders/success?reference=${order.paymentInfo?.stripePaymentIntentId}`}>
                    <Button variant="outline" size="sm" icon={ChevronRight}>
                      VIEW RECEIPT
                    </Button>
                  </Link>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
