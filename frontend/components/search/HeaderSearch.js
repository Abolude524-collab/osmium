'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { fetchProducts } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';
import { Search, Loader2, ArrowRight, X, Package } from 'lucide-react';

export const HeaderSearch = ({ className = '' }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close auto-suggest popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener ('/' or '⌘K') to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced auto-suggest search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const res = await fetchProducts({ search: query, limit: 6 });
      if (res.data && res.data.products) {
        setResults(res.data.products);
      } else {
        setResults([]);
      }
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (slug) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/products/${slug}`);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full flex items-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search 200+ products, categories, SKU..."
          icon={Search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          className="w-full text-xs font-mono py-2 pr-16 bg-graphite/80 border-border focus:border-cyan text-primary placeholder:text-secondary/60 rounded-md transition-all"
        />

        {/* Action icons right inside input */}
        <div className="absolute right-2.5 flex items-center gap-1.5 pointer-events-auto">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-cyan animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 text-secondary hover:text-primary transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden md:inline-block bg-elevated px-1.5 py-0.5 text-[9px] font-mono text-secondary/70 rounded border border-border">
              ⌘K
            </kbd>
          )}
        </div>
      </form>

      {/* In-Page Auto-Suggest Popover Dropdown (Desktop & Mobile) */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-graphite border border-border rounded-lg shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in-50 slide-in-from-top-2 duration-150">
          <div className="p-2 border-b border-border/50 flex items-center justify-between text-[10px] font-mono text-secondary px-3">
            <span>SUGGESTED RESULTS ({results.length})</span>
            <span className="text-cyan">Press Enter to view all</span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/30 p-1">
            {isLoading && results.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-secondary flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 text-cyan animate-spin" />
                <span>Searching catalog...</span>
              </div>
            ) : query.trim() && results.length === 0 && !isLoading ? (
              <div className="p-4 text-center text-xs font-mono text-secondary">
                No matching products found for '{query}'.
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="p-2.5 rounded-md hover:bg-elevated cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-obsidian border border-border overflow-hidden shrink-0">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-secondary">
                          <Package className="w-4 h-4 text-secondary/50" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] font-mono text-cyan uppercase tracking-wider line-clamp-1">
                        {product.category?.name || 'CATALOG'}
                      </span>
                      <span className="text-xs font-bold text-primary truncate group-hover:text-cyan transition-colors">
                        {product.name}
                      </span>
                      <span className="text-[10px] font-mono text-secondary/80">SKU: {product.sku}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="text-xs font-bold text-primary">{formatCurrency(product.price)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:text-cyan group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>

          {query.trim() && (
            <div className="p-2 bg-obsidian/80 border-t border-border flex justify-end">
              <Link
                href={`/products?search=${encodeURIComponent(query.trim())}`}
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-mono text-cyan hover:underline flex items-center gap-1 px-2 py-1"
              >
                <span>SEE ALL RESULTS FOR '{query}'</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
