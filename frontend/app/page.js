'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Toast } from '@/components/ui/Toast';
import { useCartStore } from '@/store/cartStore';
import { HeaderSearch } from '@/components/search/HeaderSearch';
import { formatCurrency } from '@/lib/utils';
import { 
  ArrowRight, 
  Smartphone, 
  Shirt, 
  Home, 
  Sparkles, 
  Dumbbell, 
  BookOpen, 
  Briefcase,
  Zap,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demoInput, setDemoInput] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Multi-Category Curated Sample Catalog
  const sampleProducts = [
    {
      id: '1',
      name: 'OSMIUM Zero-G Wireless Headphones',
      category: 'ELECTRONICS',
      price: 349,
      badge: 'NEW',
      sku: 'OSM-ELC-01',
      subcategory: 'Audio',
    },
    {
      id: '2',
      name: 'Minimalist Italian Leather Sneakers',
      category: 'FASHION',
      price: 185,
      badge: 'POPULAR',
      sku: 'OSM-FSH-04',
      subcategory: 'Footwear',
    },
    {
      id: '3',
      name: 'Architectural LED Desk Lamp',
      category: 'HOME & LIVING',
      price: 129,
      badge: null,
      sku: 'OSM-HOM-09',
      subcategory: 'Lighting',
    },
    {
      id: '4',
      name: 'Hydrating Botanical Facial Serum',
      category: 'BEAUTY',
      price: 64,
      badge: 'BESTSELLER',
      sku: 'OSM-BTY-02',
      subcategory: 'Skincare',
    },
    {
      id: '5',
      name: 'Precision Matte Travel Backpack',
      category: 'EVERYDAY ESSENTIALS',
      price: 149,
      badge: null,
      sku: 'OSM-ESS-07',
      subcategory: 'Travel',
    },
    {
      id: '6',
      name: 'Performance Insulated Water Bottle',
      category: 'SPORTS & FITNESS',
      price: 45,
      badge: null,
      sku: 'OSM-SPT-03',
      subcategory: 'Accessories',
    },
    {
      id: '7',
      name: 'The Creative Process & Design System',
      category: 'BOOKS & EDUCATION',
      price: 32,
      badge: null,
      sku: 'OSM-BOK-12',
      subcategory: 'Design',
    },
    {
      id: '8',
      name: 'Quantum Mechanical Tactile Keyboard',
      category: 'ELECTRONICS',
      price: 219,
      badge: 'LIMITED',
      sku: 'OSM-ELC-08',
      subcategory: 'Computing',
    },
  ];

  // Homepage Category Grid Configuration
  const categories = [
    {
      title: 'ELECTRONICS',
      description: 'Phones, Laptops, Audio & Cameras',
      icon: Smartphone,
      count: '124 items',
      href: '/products?category=electronics',
    },
    {
      title: 'FASHION',
      description: 'Apparel, Footwear, Watches & Accessories',
      icon: Shirt,
      count: '98 items',
      href: '/products?category=fashion',
    },
    {
      title: 'HOME & LIVING',
      description: 'Furniture, Kitchen, Lighting & Decor',
      icon: Home,
      count: '86 items',
      href: '/products?category=home',
    },
    {
      title: 'BEAUTY & CARE',
      description: 'Skincare, Haircare & Grooming',
      icon: Sparkles,
      count: '64 items',
      href: '/products?category=beauty',
    },
    {
      title: 'SPORTS & FITNESS',
      description: 'Equipment, Activewear & Gear',
      icon: Dumbbell,
      count: '52 items',
      href: '/products?category=sports',
    },
    {
      title: 'BOOKS & LEARNING',
      description: 'Design, Technology, Literature & Notes',
      icon: BookOpen,
      count: '40 items',
      href: '/products?category=books',
    },
    {
      title: 'EVERYDAY ESSENTIALS',
      description: 'Office, Travel, Bags & Carry',
      icon: Briefcase,
      count: '75 items',
      href: '/products?category=essentials',
    },
  ];

  return (
    <div className="flex flex-col gap-16 py-4">

      {/* Hero Section */}
      <section className="relative rounded-lg border border-border bg-gradient-to-b from-graphite to-obsidian p-8 sm:p-12 md:p-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl flex flex-col gap-6 relative z-10">
          <div className="inline-flex items-center gap-2">
            <Badge variant="accent" dot>PRECISION CURATED COMMERCE</Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-[1.05]">
            Everything worth finding.
          </h1>

          <p className="text-base sm:text-lg text-secondary leading-relaxed">
            Discover technology, fashion, essentials, and everyday objects selected with intent.
          </p>

          <div className="w-full max-w-lg my-1">
            <HeaderSearch />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link href="/products">
              <Button size="lg" icon={ArrowRight}>
                EXPLORE CATALOG
              </Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={() => setIsModalOpen(true)}>
              DESIGN SYSTEM DEMO
            </Button>
          </div>
        </div>
      </section>

      {/* Multi-Category Discovery Grid */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xs font-mono tracking-widest text-cyan uppercase mb-1">DISCOVERY</h2>
            <h3 className="text-2xl font-bold text-primary tracking-tight">Explore Categories</h3>
          </div>
          <span className="text-xs font-mono text-secondary">CURATED SELECTION ACROSS 7 DOMAINS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.title} href={cat.href}>
                <Card interactive className="h-full flex flex-col justify-between group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded bg-obsidian border border-border flex items-center justify-center text-cyan group-hover:border-cyan/50 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-secondary/70">{cat.count}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary group-hover:text-cyan transition-colors tracking-wide uppercase">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-secondary mt-1 font-sans">
                      {cat.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Curated Products Section */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xs font-mono tracking-widest text-cyan uppercase mb-1">CURATED PICKS</h2>
            <h3 className="text-2xl font-bold text-primary tracking-tight">Featured Products</h3>
          </div>
          <Link href="/products" className="text-xs font-mono text-secondary hover:text-cyan uppercase flex items-center gap-1">
            <span>VIEW ALL ({sampleProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <Card key={product.id} interactive className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-secondary tracking-wider uppercase">
                    {product.category}
                  </span>
                  {product.badge && (
                    <Badge variant={product.badge === 'NEW' ? 'accent' : 'warning'} size="sm">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base group-hover:text-cyan transition-colors line-clamp-1">
                  {product.name}
                </CardTitle>
                <CardDescription className="font-mono text-[11px]">
                  SKU: {product.sku}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-4">
                <div className="w-full h-36 rounded bg-obsidian border border-border/50 flex flex-col items-center justify-center gap-1 text-secondary/40 font-mono text-xs">
                  <span>[ PRODUCT IMAGE ]</span>
                  <span className="text-[10px] text-secondary/30">{product.subcategory}</span>
                </div>
              </CardContent>

              <CardFooter>
                <span className="text-lg font-bold font-mono text-primary">{formatCurrency(product.price)}</span>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => {
                    addItem({
                      _id: product.id,
                      name: product.name,
                      slug: product.sku?.toLowerCase() || product.id,
                      sku: product.sku,
                      price: product.price,
                      category: { name: product.category },
                    });
                    setToastMessage(`Added ${product.name} to cart`);
                  }}
                >
                  + ADD
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform Core Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card elevated>
          <CardHeader>
            <Zap className="w-6 h-6 text-cyan mb-2" />
            <CardTitle>Ultra Fast Performance</CardTitle>
            <CardDescription>Server-side rendering with Next.js App Router for instant load times across all categories.</CardDescription>
          </CardHeader>
        </Card>

        <Card elevated>
          <CardHeader>
            <ShieldCheck className="w-6 h-6 text-success mb-2" />
            <CardTitle>Authoritative Security</CardTitle>
            <CardDescription>All prices, inventory, and cart totals strictly validated on the server.</CardDescription>
          </CardHeader>
        </Card>

        <Card elevated>
          <CardHeader>
            <Cpu className="w-6 h-6 text-warning mb-2" />
            <CardTitle>Clean Modular Architecture</CardTitle>
            <CardDescription>Flexible attribute schema supporting diverse product types and categories seamlessly.</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Interactive UI Primitives Demo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="OSMIUM DESIGN SYSTEM PRIMITIVES"
        subtitle="Phase 1 Foundation Verification"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-secondary uppercase">1. BUTTON VARIANTS</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">Primary Cyan</Button>
              <Button variant="secondary" size="sm">Secondary Graphite</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="danger" size="sm">Danger</Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-secondary uppercase">2. STATUS BADGES</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent" dot>ACCENT CYAN</Badge>
              <Badge variant="success" dot>SUCCESS</Badge>
              <Badge variant="warning" dot>WARNING</Badge>
              <Badge variant="error" dot>ERROR</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-secondary uppercase">3. FORM INPUT & SELECT</span>
            <Input 
              label="Product SKU Code" 
              placeholder="e.g. OSM-ELC-001" 
              value={demoInput} 
              onChange={(e) => setDemoInput(e.target.value)} 
            />
            <Select 
              label="Catalog Category" 
              options={[
                { value: 'electronics', label: 'Electronics & Audio' },
                { value: 'fashion', label: 'Fashion & Apparel' },
                { value: 'home', label: 'Home & Living' },
                { value: 'beauty', label: 'Beauty & Care' },
              ]} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-secondary uppercase">4. SKELETON LOADER</span>
            <div className="flex gap-3">
              <Skeleton className="w-12 h-12 rounded" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            type="success"
            title="Cart Updated"
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

    </div>
  );
}
