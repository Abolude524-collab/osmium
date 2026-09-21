'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Drawer } from '@/components/ui/Drawer';
import { Toast } from '@/components/ui/Toast';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/authStore';
import { fetchProducts, fetchCategories } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, RefreshCw, Loader2, Heart } from 'lucide-react';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { token } = useAuthStore();

  // URL state params
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to update URL search parameters
  const updateParams = useCallback((newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  // Load Categories on Mount
  useEffect(() => {
    async function loadCategories() {
      const cats = await fetchCategories();
      setCategories(cats);
    }
    loadCategories();
  }, []);

  // Fetch Products whenever query params change
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      const res = await fetchProducts({
        search: currentSearch,
        category: currentCategory,
        sort: currentSort,
        minPrice: currentMinPrice,
        maxPrice: currentMaxPrice,
        page: currentPage,
        limit: 8,
      });

      if (res.data && res.data.products) {
        setProducts(res.data.products);
        setPagination(res.pagination || {});
      } else {
        setProducts([]);
        setPagination({});
      }
      setIsLoading(false);
    }

    loadProducts();
  }, [currentSearch, currentCategory, currentSort, currentMinPrice, currentMaxPrice, currentPage]);

  // Search Submit Handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput, page: 1 });
  };

  // Price Filter Apply Handler
  const handlePriceApply = () => {
    updateParams({ minPrice: minPriceInput, maxPrice: maxPriceInput, page: 1 });
    setIsFilterDrawerOpen(false);
  };

  // Clear All Filters
  const handleResetFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    router.push('/products');
    setIsFilterDrawerOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 py-4">

      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <span className="text-xs font-mono tracking-widest text-cyan uppercase">CATALOG DIRECTORY</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">All Products</h1>
        <p className="text-sm text-secondary">
          Explore curated technology, fashion, living essentials, and design objects.
        </p>
      </div>

      {/* Search, Filter Bar & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-80 flex items-center gap-2">
          <Input
            placeholder="Search catalog..."
            icon={Search}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {/* Filter Drawer Trigger & Sort Selector */}
        <div className="w-full sm:w-auto flex items-center gap-3 justify-between sm:justify-end">
          <Button
            variant="secondary"
            size="md"
            icon={SlidersHorizontal}
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            FILTERS {currentCategory || currentMinPrice || currentMaxPrice ? '(ACTIVE)' : ''}
          </Button>

          <Select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
            options={[
              { value: 'newest', label: 'Sort: Newest First' },
              { value: 'price_asc', label: 'Sort: Price Low to High' },
              { value: 'price_desc', label: 'Sort: Price High to Low' },
              { value: 'rating_desc', label: 'Sort: Highest Rated' },
            ]}
            className="w-48"
          />
        </div>
      </div>

      {/* Main Content: Sidebar + Product Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 p-5 rounded-md border border-border bg-graphite/40 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-xs font-mono tracking-wider text-primary uppercase">FILTERS</h3>
            {(currentCategory || currentMinPrice || currentMaxPrice || currentSearch) && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-mono text-cyan hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> RESET
              </button>
            )}
          </div>

          {/* Category Filter List */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono text-secondary uppercase">CATEGORY</span>
            <button
              onClick={() => updateParams({ category: '', page: 1 })}
              className={`text-xs text-left py-1.5 px-2 rounded transition-colors ${
                !currentCategory ? 'bg-cyan/10 text-cyan font-semibold' : 'text-secondary hover:text-primary'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateParams({ category: cat.slug, page: 1 })}
                className={`text-xs text-left py-1.5 px-2 rounded transition-colors ${
                  currentCategory === cat.slug ? 'bg-cyan/10 text-cyan font-semibold' : 'text-secondary hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Price Filter */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
            <span className="text-[11px] font-mono text-secondary uppercase">PRICE RANGE (₦)</span>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
              />
              <span className="text-secondary">-</span>
              <Input
                placeholder="Max"
                type="number"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
              />
            </div>
            <Button variant="secondary" size="sm" onClick={handlePriceApply}>
              APPLY PRICE
            </Button>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 flex flex-col gap-8">
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3 p-4 rounded bg-graphite border border-border">
                  <Skeleton className="w-full h-40 rounded" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products match your filters"
              description="Try resetting your price range, search query, or selecting another category."
              actionLabel="CLEAR FILTERS"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id} interactive className="flex flex-col justify-between group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-secondary tracking-wider uppercase">
                        {product.category?.name || product.subcategory || 'OSMIUM'}
                      </span>
                      <div className="flex items-center gap-2">
                        {product.featured && <Badge variant="accent" size="sm">FEATURED</Badge>}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product, token);
                          }}
                          className="p-1 rounded-md text-secondary hover:text-rose-500 transition-colors"
                          title="Bookmark to Wishlist"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isInWishlist(product._id)
                                ? 'fill-rose-500 text-rose-500'
                                : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <Link href={`/products/${product.slug}`}>
                      <CardTitle className="text-base group-hover:text-cyan transition-colors line-clamp-1">
                        {product.name}
                      </CardTitle>
                    </Link>
                    <CardDescription className="font-mono text-[11px]">
                      SKU: {product.sku}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="py-3">
                    <Link href={`/products/${product.slug}`}>
                      <div className="w-full h-36 rounded bg-obsidian border border-border/50 overflow-hidden relative group-hover:border-cyan/40 transition-colors">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-secondary/30 font-mono text-xs">
                            [ NO IMAGE ]
                          </div>
                        )}
                      </div>
                    </Link>
                  </CardContent>

                  <CardFooter>
                    <div className="flex flex-col">
                      <span className="text-base font-bold font-mono text-primary">
                        {formatCurrency(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-[11px] font-mono text-secondary line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        addItem(product);
                        setToastMessage(`Added ${product.name} to cart`);
                      }}
                    >
                      + ADD
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-border font-mono text-xs text-secondary">
              <span>
                Page {pagination.page} of {pagination.totalPages} ({pagination.totalProducts} items)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => updateParams({ page: pagination.page - 1 })}
                  icon={ChevronLeft}
                >
                  PREV
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => updateParams({ page: pagination.page + 1 })}
                  icon={ChevronRight}
                >
                  NEXT
                </Button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="FILTER CATALOG"
        subtitle="Refine products by category and price"
        position="right"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-secondary uppercase">CATEGORY</span>
            <button
              onClick={() => { updateParams({ category: '', page: 1 }); setIsFilterDrawerOpen(false); }}
              className={`text-xs text-left py-2 px-3 rounded ${!currentCategory ? 'bg-cyan/10 text-cyan font-bold' : 'text-secondary'}`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => { updateParams({ category: cat.slug, page: 1 }); setIsFilterDrawerOpen(false); }}
                className={`text-xs text-left py-2 px-3 rounded ${currentCategory === cat.slug ? 'bg-cyan/10 text-cyan font-bold' : 'text-secondary'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <span className="text-xs font-mono text-secondary uppercase">PRICE RANGE (₦)</span>
            <div className="flex items-center gap-2">
              <Input placeholder="Min" type="number" value={minPriceInput} onChange={(e) => setMinPriceInput(e.target.value)} />
              <span>-</span>
              <Input placeholder="Max" type="number" value={maxPriceInput} onChange={(e) => setMaxPriceInput(e.target.value)} />
            </div>
            <Button variant="primary" size="md" onClick={handlePriceApply} className="mt-2">
              APPLY FILTERS
            </Button>
          </div>
        </div>
      </Drawer>

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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 text-cyan animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
