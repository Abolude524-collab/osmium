'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Shield, Package, ShoppingBag, LogOut, Calendar, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  const { user, token, logout, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!user && token) {
      fetchProfile();
    }
  }, [user, token, fetchProfile]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center max-w-md mx-auto py-12">
        <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-primary">Sign In Required</h1>
        <p className="text-secondary text-sm">Please sign in to view your customer account settings and orders.</p>
        <Link href="/login?redirect=/account">
          <Button variant="primary" icon={ArrowRight}>SIGN IN</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <span className="text-xs font-mono tracking-widest text-cyan uppercase">CUSTOMER DASHBOARD</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">Account Overview</h1>
        <p className="text-sm text-secondary">
          Manage your account profile, order history, and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Details Card */}
        <Card elevated className="md:col-span-2">
          <CardHeader className="pb-4 border-b border-border flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-cyan" /> Profile Information
            </CardTitle>
            <Badge variant={user.role === 'admin' ? 'warning' : 'accent'} size="sm">
              {user.role === 'admin' ? 'ADMINISTRATOR' : 'CUSTOMER'}
            </Badge>
          </CardHeader>

          <CardContent className="pt-6 flex flex-col gap-5 font-mono text-xs">
            <div className="flex flex-col gap-1 p-3 rounded bg-obsidian border border-border">
              <span className="text-secondary uppercase">FULL NAME</span>
              <span className="text-primary text-sm font-bold">{user.name}</span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded bg-obsidian border border-border">
              <span className="text-secondary uppercase">EMAIL ADDRESS</span>
              <span className="text-primary text-sm font-bold">{user.email}</span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded bg-obsidian border border-border">
              <span className="text-secondary uppercase">ACCOUNT STATUS</span>
              <span className="text-success text-sm font-bold uppercase">ACTIVE & VERIFIED</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <div className="flex flex-col gap-4">
          <Card elevated>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-mono uppercase">QUICK NAVIGATION</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              
              <Link href="/orders">
                <Button variant="secondary" size="md" icon={Package} className="w-full justify-start">
                  MY ORDER HISTORY
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="outline" size="md" icon={ShoppingBag} className="w-full justify-start">
                  VIEW SHOPPING CART
                </Button>
              </Link>

              {user.role === 'admin' && (
                <Link href="/admin">
                  <Button variant="danger" size="md" icon={Shield} className="w-full justify-start">
                    ADMIN PANEL
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="md"
                icon={LogOut}
                onClick={logout}
                className="w-full justify-start text-error hover:bg-error/10 mt-2"
              >
                SIGN OUT
              </Button>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
