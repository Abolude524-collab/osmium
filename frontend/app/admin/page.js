'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAdminMetrics } from '@/services/adminService';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  AlertTriangle, 
  PlusCircle, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      setIsLoading(true);
      const res = await fetchAdminMetrics();
      setData(res);
      setIsLoading(false);
    }
    loadMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    activeProducts: 0,
    lowStockCount: 0,
  };

  const lowStockProducts = data?.lowStockProducts || [];

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">System Overview</h1>
          <p className="text-xs text-secondary font-mono mt-0.5">
            Real-time sales revenue, inventory alerts, and customer activity
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm" icon={PlusCircle}>
            ADD NEW PRODUCT
          </Button>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <Card elevated className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-secondary uppercase">TOTAL REVENUE</span>
            <div className="p-2 rounded bg-cyan/10 border border-cyan/30 text-cyan">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-primary">
              {formatCurrency(metrics.totalRevenue)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-success font-mono mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Verified Paid Orders</span>
            </div>
          </div>
        </Card>

        {/* Total Orders */}
        <Card elevated className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-secondary uppercase">TOTAL ORDERS</span>
            <div className="p-2 rounded bg-warning/10 border border-warning/30 text-warning">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-primary">
              {metrics.totalOrders}
            </span>
            <span className="text-[11px] text-secondary font-mono block mt-1">
              Transactions Processed
            </span>
          </div>
        </Card>

        {/* Catalog Products */}
        <Card elevated className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-secondary uppercase">CATALOG PRODUCTS</span>
            <div className="p-2 rounded bg-cyan/10 border border-cyan/30 text-cyan">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-primary">
              {metrics.totalProducts}
            </span>
            <span className="text-[11px] text-secondary font-mono block mt-1">
              {metrics.activeProducts} Active Listing(s)
            </span>
          </div>
        </Card>

        {/* Total Customers */}
        <Card elevated className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-secondary uppercase">CUSTOMERS</span>
            <div className="p-2 rounded bg-success/10 border border-success/30 text-success">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-primary">
              {metrics.totalCustomers}
            </span>
            <span className="text-[11px] text-secondary font-mono block mt-1">
              Registered Accounts
            </span>
          </div>
        </Card>

      </div>

      {/* Low-Stock Inventory Alerts Table */}
      <Card elevated>
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
          <div>
            <CardTitle className="text-base font-mono uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span>LOW-STOCK INVENTORY ALERTS ({lowStockProducts.length})</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Products requiring immediate stock replenishment (Quantity ≤ 5)
            </CardDescription>
          </div>
          <Link href="/admin/products" className="text-xs font-mono text-cyan hover:underline">
            MANAGE ALL PRODUCTS
          </Link>
        </CardHeader>

        <CardContent className="pt-4">
          {lowStockProducts.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-secondary">
              ✓ All products have sufficient stock levels.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-secondary uppercase">
                    <th className="pb-2">PRODUCT NAME</th>
                    <th className="pb-2">SKU</th>
                    <th className="pb-2">STOCK STATUS</th>
                    <th className="pb-2 text-right">UNIT PRICE</th>
                    <th className="pb-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {lowStockProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-elevated/50 transition-colors">
                      <td className="py-3 font-semibold text-primary">{prod.name}</td>
                      <td className="py-3 text-secondary">{prod.sku}</td>
                      <td className="py-3">
                        <Badge variant={prod.stock === 0 ? 'error' : 'warning'} size="sm" dot>
                          {prod.stock === 0 ? 'OUT OF STOCK' : `${prod.stock} UNITS LEFT`}
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-bold text-primary">
                        {formatCurrency(prod.price)}
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/admin/products/${prod._id}/edit`}>
                          <Button variant="secondary" size="sm">
                            RESTOCK
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
