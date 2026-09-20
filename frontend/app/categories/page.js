'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCategories } from '@/services/productService';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowRight, Layers } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      const cats = await fetchCategories();
      setCategories(cats);
      setIsLoading(false);
    }
    loadCategories();
  }, []);

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <span className="text-xs font-mono tracking-widest text-cyan uppercase">EXPLORE CATALOG</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">Product Categories</h1>
        <p className="text-sm text-secondary">
          Discover items organized across 7 curated retail domains.
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full h-40 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/products?category=${cat.slug}`}>
              <Card interactive className="h-full flex flex-col justify-between group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center font-mono text-xs font-bold">
                      {cat.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-secondary">DISCOVER</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-cyan transition-colors uppercase tracking-wide">
                    {cat.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {cat.description || 'Explore products in this category.'}
                  </CardDescription>
                </CardHeader>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono text-secondary group-hover:text-cyan transition-colors">
                  <span>BROWSE CATEGORY</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
