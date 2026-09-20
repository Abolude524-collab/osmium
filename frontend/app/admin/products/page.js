'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchProducts } from '@/services/productService';
import { deleteProductAdmin } from '@/services/adminService';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Toast } from '@/components/ui/Toast';
import { PlusCircle, Search, Edit2, Trash2, ExternalLink, RefreshCw } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const loadProducts = async () => {
    setIsLoading(true);
    const res = await fetchProducts({ search, limit: 50 });
    if (res.data && res.data.products) {
      setProducts(res.data.products);
    } else {
      setProducts([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleDelete = async (productId, productName) => {
    if (confirm(`Are you sure you want to delete '${productName}' from the catalog?`)) {
      const res = await deleteProductAdmin(productId);
      if (res.success) {
        setToastMessage(`Deleted '${productName}'`);
        loadProducts();
      } else {
        alert(`Error deleting product: ${res.error}`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-secondary font-mono mt-0.5">
            Create, edit, restock, or archive catalog items across all categories
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm" icon={PlusCircle}>
            ADD NEW PRODUCT
          </Button>
        </Link>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search SKU, name, brand..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={loadProducts}
          className="text-xs font-mono text-secondary hover:text-cyan p-2 rounded hover:bg-elevated transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> REFRESH
        </button>
      </div>

      {/* Table */}
      <Card elevated>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex flex-col gap-3 py-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-secondary">
              No products found matching '{search}'.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border text-secondary uppercase">
                    <th className="pb-3">PRODUCT</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3">CATEGORY</th>
                    <th className="pb-3">PRICE</th>
                    <th className="pb-3">STOCK</th>
                    <th className="pb-3">STATUS</th>
                    <th className="pb-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-elevated/40 transition-colors">
                      
                      {/* Product Name & Image */}
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-obsidian border border-border overflow-hidden shrink-0">
                            {prod.images && prod.images[0] ? (
                              <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-secondary">NO IMG</div>
                            )}
                          </div>
                          <span className="font-semibold text-primary truncate max-w-xs">{prod.name}</span>
                        </div>
                      </td>

                      <td className="py-3 text-secondary">{prod.sku}</td>

                      <td className="py-3 text-cyan uppercase">{prod.category?.name || 'CATALOG'}</td>

                      <td className="py-3 font-bold text-primary">{formatCurrency(prod.price)}</td>

                      <td className="py-3">
                        <span className={prod.stock <= 5 ? 'text-warning font-bold' : 'text-primary'}>
                          {prod.stock}
                        </span>
                      </td>

                      <td className="py-3">
                        <Badge variant={prod.status === 'active' ? 'success' : 'default'} size="sm">
                          {prod.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${prod.slug}`} target="_blank" title="View on storefront">
                            <button className="p-1 text-secondary hover:text-cyan transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </Link>
                          <Link href={`/admin/products/${prod._id}/edit`} title="Edit product">
                            <button className="p-1 text-secondary hover:text-cyan transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(prod._id, prod.name)}
                            className="p-1 text-secondary hover:text-error transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast type="info" title="Admin Notice" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}

    </div>
  );
}
