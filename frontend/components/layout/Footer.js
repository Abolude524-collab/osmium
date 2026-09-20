'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Footer = () => {
  const pathname = usePathname();

  // Show footer ONLY on the Homepage / Landing Page
  if (pathname !== '/') {
    return null;
  }

  return (
    <footer className="bg-graphite border-t border-border mt-20 text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-cyan/10 border border-cyan/30 text-cyan font-mono font-bold text-xs flex items-center justify-center">
                Os
              </span>
              <span className="font-sans font-bold tracking-[0.25em] text-primary text-sm uppercase">
                OSMIUM
              </span>
            </Link>
            <p className="text-xs text-secondary leading-relaxed">
              Curated products, everyday essentials, and objects selected with intent.
            </p>
          </div>

          {/* Catalog Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-mono tracking-wider text-primary uppercase mb-1">Catalog</h4>
            <Link href="/products?category=electronics" className="text-xs hover:text-cyan transition-colors">Electronics & Audio</Link>
            <Link href="/products?category=fashion" className="text-xs hover:text-cyan transition-colors">Fashion & Accessories</Link>
            <Link href="/products?category=home" className="text-xs hover:text-cyan transition-colors">Home & Living</Link>
            <Link href="/products?category=beauty" className="text-xs hover:text-cyan transition-colors">Beauty & Personal Care</Link>
            <Link href="/products?category=essentials" className="text-xs hover:text-cyan transition-colors">Everyday Essentials</Link>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-mono tracking-wider text-primary uppercase mb-1">Support</h4>
            <Link href="/account/orders" className="text-xs hover:text-cyan transition-colors">Order Tracking</Link>
            <Link href="/shipping" className="text-xs hover:text-cyan transition-colors">Shipping & Returns</Link>
            <Link href="/privacy" className="text-xs hover:text-cyan transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs hover:text-cyan transition-colors">Terms of Service</Link>
          </div>

          {/* Technical Specs & System Status */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono tracking-wider text-primary uppercase mb-1">System Status</h4>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-obsidian border border-border text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-primary">ALL SYSTEMS OPERATIONAL</span>
            </div>
            <p className="text-[10px] font-mono text-secondary/70">
              BUILD: OSM-v1.0.0-PROD | REGION: US-EAST-1
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-secondary/60">
          <p>© {new Date().getFullYear()} OSMIUM INC. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <span>SECURE CHECKOUT BY STRIPE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
