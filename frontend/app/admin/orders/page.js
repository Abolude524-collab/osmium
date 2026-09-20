'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { Toast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import { ShoppingBag, RefreshCw, Filter } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRealOrders = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const res = await fetch(`${API_URL}/orders${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setOrders(data.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Fetch admin orders error:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealOrders();
  }, [token, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setOrders((prev) =>
          prev.map((ord) =>
            ord._id === orderId ? { ...ord, fulfillmentStatus: newStatus } : ord
          )
        );
        setToastMessage(`Updated order status to '${newStatus.toUpperCase()}'`);
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Network error while updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Order Fulfillment Management</h1>
          <p className="text-xs text-secondary font-mono mt-0.5">
            Monitor real transactions, verify Paystack payments, and update fulfillment tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Fulfillment Statuses' },
              { value: 'pending', label: 'Filter: Pending' },
              { value: 'processing', label: 'Filter: Processing' },
              { value: 'shipped', label: 'Filter: Shipped' },
              { value: 'delivered', label: 'Filter: Delivered' },
              { value: 'cancelled', label: 'Filter: Cancelled' },
            ]}
            className="w-48 text-xs font-mono"
          />

          <button
            onClick={fetchRealOrders}
            className="p-2.5 rounded bg-graphite border border-border text-secondary hover:text-cyan hover:border-cyan transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Card elevated>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex flex-col gap-3 py-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-secondary">
              No orders found in system database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border text-secondary uppercase">
                    <th className="pb-3">ORDER #</th>
                    <th className="pb-3">CUSTOMER</th>
                    <th className="pb-3">PAYMENT</th>
                    <th className="pb-3">TOTAL</th>
                    <th className="pb-3">FULFILLMENT STATUS</th>
                    <th className="pb-3 text-right">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-elevated/40 transition-colors">
                      <td className="py-3 font-bold text-cyan">#{ord.orderNumber}</td>
                      
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">{ord.user?.name || ord.shippingAddress?.fullName || 'Guest Customer'}</span>
                          <span className="text-[10px] text-secondary">{ord.user?.email || 'N/A'}</span>
                        </div>
                      </td>

                      <td className="py-3">
                        <Badge
                          variant={ord.paymentInfo?.status === 'paid' ? 'success' : 'warning'}
                          size="sm"
                          dot
                        >
                          {ord.paymentInfo?.status?.toUpperCase() || 'PENDING'}
                        </Badge>
                      </td>

                      <td className="py-3 font-bold text-primary">{formatCurrency(ord.totalAmount)}</td>

                      <td className="py-3">
                        <Select
                          value={ord.fulfillmentStatus}
                          disabled={updatingId === ord._id}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          options={[
                            { value: 'pending', label: 'Pending' },
                            { value: 'processing', label: 'Processing' },
                            { value: 'shipped', label: 'Shipped' },
                            { value: 'delivered', label: 'Delivered' },
                            { value: 'cancelled', label: 'Cancelled' },
                          ]}
                          className="w-36 text-xs"
                        />
                      </td>

                      <td className="py-3 text-right text-secondary">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast type="success" title="Fulfillment Updated" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}

    </div>
  );
}
