'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { fetchProducts } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';
import { Search, Loader2, ArrowRight, Package } from 'lucide-react';

export const SearchModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced instant search query effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const res = await fetchProducts({ search: query, limit: 6 });
      if (res.data && res.data.products) {
        setResults(res.data.products);
      } else {
        setResults([]);
      }
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (slug) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="INSTANT CATALOG SEARCH" subtitle="Search across products, categories, and SKU codes">
      <div className="flex flex-col gap-6">
        
        {/* Search Input */}
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder="Type product name, category, or SKU..."
            icon={Search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base font-medium py-3"
          />
          {isLoading && (
            <div className="absolute right-3 top-3.5">
              <Loader2 className="w-4 h-4 text-cyan animate-spin" />
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {query.trim() && results.length === 0 && !isLoading ? (
            <div className="p-6 text-center text-xs font-mono text-secondary">
              No products found matching '{query}'.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product._id}
                onClick={() => handleSelectProduct(product.slug)}
                className="p-3 rounded-md bg-obsidian border border-border hover:border-cyan cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded bg-graphite border border-border overflow-hidden shrink-0">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-secondary">IMG</div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono text-cyan uppercase tracking-wider">
                      {product.category?.name || 'CATALOG'}
                    </span>
                    <span className="text-sm font-bold text-primary truncate group-hover:text-cyan transition-colors">
                      {product.name}
                    </span>
                    <span className="text-xs font-mono text-secondary">SKU: {product.sku}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono">
                  <span className="text-sm font-bold text-primary">{formatCurrency(product.price)}</span>
                  <ArrowRight className="w-4 h-4 text-secondary group-hover:text-cyan group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {query.trim() && results.length > 0 && (
          <div className="pt-2 border-t border-border flex justify-end">
            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-xs font-mono text-cyan hover:underline inline-flex items-center gap-1"
            >
              <span>VIEW ALL MATCHING RESULTS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
    </Modal>
  );
};
