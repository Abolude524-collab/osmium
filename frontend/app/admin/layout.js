'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  ShieldAlert, 
  ArrowLeft 
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login?redirect=/admin');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 py-16">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <p className="text-xs font-mono text-secondary">Verifying administrative authorization...</p>
      </div>
    );
  }

  const navItems = [
    { label: 'OVERVIEW', href: '/admin', icon: LayoutDashboard },
    { label: 'PRODUCTS', href: '/admin/products', icon: Package },
    { label: 'ADD PRODUCT', href: '/admin/products/new', icon: PlusCircle },
    { label: 'ORDERS', href: '/admin/orders', icon: ShoppingBag },
    { label: 'CUSTOMERS', href: '/admin/customers', icon: Users },
    { label: 'ANALYTICS', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4 min-h-[80vh]">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-64 flex flex-col gap-6 p-5 rounded-md border border-border bg-graphite shrink-0 h-fit">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-warning/20 border border-warning/40 text-warning font-mono font-bold text-xs flex items-center justify-center">
              Ad
            </span>
            <span className="font-mono text-xs font-bold tracking-wider text-primary uppercase">
              ADMIN PANEL
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-cyan/10 text-cyan border border-cyan/30 font-bold'
                    : 'text-secondary hover:text-primary hover:bg-elevated'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan' : 'text-secondary'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-secondary hover:text-cyan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>STOREFRONT</span>
          </Link>
          <div className="text-[10px] font-mono text-secondary/60 mt-2">
            LOGGED IN AS: <span className="text-primary">{user.email}</span>
          </div>
        </div>
      </aside>

      {/* Main Admin Dashboard View */}
      <main className="flex-1 min-w-0">
        {children}
      </main>

    </div>
  );
}
