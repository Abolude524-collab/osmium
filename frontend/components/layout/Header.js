'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu, LogOut, Shield, Heart } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { HeaderSearch } from '@/components/search/HeaderSearch';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user, logout, fetchProfile } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const openCartDrawer = useCartStore((state) => state.openCartDrawer);

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, [fetchProfile]);

  const navLinks = [
    { label: 'Shop', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Deals', href: '/products?onSale=true' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-obsidian/95 backdrop-blur-md border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Mobile Menu Trigger & Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-secondary hover:text-cyan p-1.5 rounded-md hover:bg-elevated transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-7 h-7 rounded bg-cyan/10 border border-cyan/30 text-cyan font-mono font-bold text-xs flex items-center justify-center group-hover:border-cyan transition-colors">
                Os
              </span>
              <span className="font-sans font-bold tracking-[0.25em] text-primary text-base uppercase">
                OSMIUM
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-medium tracking-wider text-secondary hover:text-cyan uppercase transition-colors shrink-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Integrated Desktop & Tablet In-Page Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-2">
            <HeaderSearch />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Account Action */}
            {mounted && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/orders'}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-graphite border border-border text-xs font-mono text-primary hover:border-cyan/40 transition-colors"
                  title={user.role === 'admin' ? 'Admin Dashboard' : 'My Orders'}
                >
                  {user.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-warning shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-cyan shrink-0" />
                  )}
                  <span className="hidden md:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-secondary hover:text-error rounded-md hover:bg-elevated transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : mounted ? (
              <Link
                href="/login"
                className="p-2 text-secondary hover:text-cyan rounded-md hover:bg-elevated transition-colors flex items-center gap-1.5 text-xs font-mono"
              >
                <User className="w-4 h-4 text-cyan" />
                <span className="hidden sm:inline uppercase">SIGN IN</span>
              </Link>
            ) : null}

            {/* Wishlist Link & Badge */}
            <Link
              href="/wishlist"
              className="relative p-2 text-secondary hover:text-rose-500 rounded-md hover:bg-elevated transition-colors"
              title="My Wishlist"
            >
              <Heart className="w-4 h-4" />
              {mounted && useWishlistStore.getState().items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-in zoom-in duration-200">
                  {useWishlistStore.getState().items.length}
                </span>
              )}
            </Link>

            {/* Cart Icon & Badge */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 text-secondary hover:text-cyan rounded-md hover:bg-elevated transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan text-obsidian font-mono text-[10px] font-bold flex items-center justify-center animate-in zoom-in duration-200">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dedicated Mobile Inline Search Row (Visible on small screens < sm) */}
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-border/40 bg-obsidian">
          <HeaderSearch />
        </div>

        {/* Mobile Menu Drawer */}
        <Drawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          title="NAVIGATION"
          subtitle="OSMIUM Catalog & Account"
          position="left"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-primary hover:text-cyan py-2 border-b border-border/40 uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-mono text-primary hover:text-cyan"
                  >
                    <User className="w-4 h-4 text-cyan" />
                    <span>MY ORDERS ({user.name})</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-xs font-mono text-warning"
                    >
                      <Shield className="w-4 h-4" />
                      <span>ADMIN DASHBOARD</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-xs font-mono text-error hover:underline text-left mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>LOGOUT</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-mono text-cyan hover:underline"
                  >
                    <User className="w-4 h-4" />
                    <span>SIGN IN TO ACCOUNT</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-mono text-secondary hover:text-cyan"
                  >
                    <span>CREATE NEW ACCOUNT</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </header>
    </>
  );
};
