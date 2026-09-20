'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Package, Award, PieChart, Layers } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminAnalyticsPage() {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!token) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/admin/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (res.ok && json.status === 'success') {
          setData(json.data);
        }
      } catch (err) {
        console.error('Fetch analytics error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded" />
          <Skeleton className="h-32 rounded" />
          <Skeleton className="h-32 rounded" />
        </div>
        <Skeleton className="h-64 w-full rounded" />
      </div>
    );
  }

  const summary = data?.summary || { totalRevenue: 0, totalOrders: 0, fulfillmentDistribution: {} };
  const topProducts = data?.topSellingProducts || [];
  const categoryBreakdown = data?.categoryBreakdown || [];

  const maxCategoryRevenue = Math.max(...categoryBreakdown.map((c) => c.revenue), 1);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Sales & Performance Analytics</h1>
          <p className="text-xs text-secondary font-mono mt-0.5">
            Real-time revenue metrics, product leaderboards, and category breakdown
          </p>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Verified Revenue */}
        <Card elevated className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-secondary uppercase">VERIFIED NET REVENUE</span>
            <div className="p-2 rounded bg-cyan/10 border border-cyan/30 text-cyan">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold font-mono text-primary">
              {formatCurrency(summary.totalRevenue)}
            </span>
            <span className="text-xs font-mono text-success flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Excludes cancelled/refunded transactions
            </span>
          </div>
        </Card>

        {/* Total Orders Processed */}
        <Card elevated className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-secondary uppercase">SYSTEM TRANSACTIONS</span>
            <div className="p-2 rounded bg-warning/10 border border-warning/30 text-warning">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold font-mono text-primary">
              {summary.totalOrders}
            </span>
            <span className="text-xs font-mono text-secondary block mt-1">
              Total Customer Orders Created
            </span>
          </div>
        </Card>

        {/* Active Categories Count */}
        <Card elevated className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono text-secondary uppercase">ACTIVE DOMAINS</span>
            <div className="p-2 rounded bg-success/10 border border-success/30 text-success">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold font-mono text-primary">
              {categoryBreakdown.length}
            </span>
            <span className="text-xs font-mono text-secondary block mt-1">
              Generating Live Revenue
            </span>
          </div>
        </Card>

      </div>

      {/* Main Grid: Category Revenue & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Category Revenue Distribution */}
        <Card elevated flex>
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-mono uppercase flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan" />
              <span>CATEGORY REVENUE BREAKDOWN</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Revenue distribution across catalog category domains
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 flex flex-col gap-5">
            {categoryBreakdown.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-secondary">
                No category sales recorded yet.
              </div>
            ) : (
              categoryBreakdown.map((cat, idx) => {
                const percentage = Math.round((cat.revenue / maxCategoryRevenue) * 100);
                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-primary font-bold uppercase">{cat.categoryName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-secondary">{cat.itemsSold} units</span>
                        <span className="text-cyan font-bold">{formatCurrency(cat.revenue)}</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-obsidian border border-border/60 overflow-hidden">
                      <div
                        className="h-full bg-cyan rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Right: Fulfillment Status Ratio Breakdown */}
        <Card elevated>
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-mono uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-warning" />
              <span>FULFILLMENT PIPELINE STATUS</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Real-time distribution of physical logistics processing stages
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 flex flex-col gap-4 font-mono text-xs">
            {Object.entries(summary.fulfillmentDistribution).map(([status, count]) => (
              <div key={status} className="p-3 rounded bg-obsidian border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
                  <span className="uppercase text-primary font-semibold">{status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={status === 'delivered' ? 'success' : status === 'cancelled' ? 'error' : 'default'} size="sm">
                    {count} {count === 1 ? 'ORDER' : 'ORDERS'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

      {/* Top Best-Selling Products Leaderboard Table */}
      <Card elevated>
        <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-mono uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-warning" />
              <span>TOP BEST-SELLING PRODUCTS LEADERBOARD</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Ranked by total quantity units sold in verified customer transactions
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {topProducts.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-secondary">
              No product sales recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border text-secondary uppercase">
                    <th className="pb-3 w-12">RANK</th>
                    <th className="pb-3">PRODUCT</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3 text-right">UNITS SOLD</th>
                    <th className="pb-3 text-right">REVENUE GENERATED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {topProducts.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-elevated/40 transition-colors">
                      <td className="py-3">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                          idx === 0 ? 'bg-warning/20 text-warning border border-warning/40' : 'bg-obsidian text-secondary border border-border'
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-obsidian border border-border overflow-hidden shrink-0">
                            {prod.image ? (
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-secondary">IMG</div>
                            )}
                          </div>
                          <span className="font-bold text-primary">{prod.name}</span>
                        </div>
                      </td>

                      <td className="py-3 text-secondary">{prod.sku || 'OSM-PROD'}</td>

                      <td className="py-3 text-right font-bold text-cyan">{prod.totalUnitsSold} units</td>

                      <td className="py-3 text-right font-extrabold text-primary">
                        {formatCurrency(prod.totalRevenueGenerated)}
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
