'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById, fetchCategories } from '@/services/productService';
import { updateProductAdmin } from '@/services/adminService';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Toast } from '@/components/ui/Toast';
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [brand, setBrand] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [status, setStatus] = useState('active');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [attributes, setAttributes] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('osmium_token') : null;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ image: reader.result, fileName: file.name }),
        });
        const data = await res.json();
        setIsUploading(false);
        if (data.status === 'success' && data.data?.url) {
          setImageUrl(data.data.url);
          setToastMessage('Image uploaded successfully');
        } else {
          setFormError(data.message || 'Failed to upload image');
        }
      } catch (err) {
        setIsUploading(false);
        setFormError('Image upload failed');
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [cats, prodRes] = await Promise.all([
        fetchCategories(),
        fetchProductById(id),
      ]);

      setCategories(cats);

      const prod = prodRes?.data?.product || prodRes;

      if (prod && (prod._id || prod.name)) {
        setName(prod.name || '');
        setSku(prod.sku || '');
        setCategory(
          typeof prod.category === 'object' && prod.category !== null
            ? prod.category._id
            : prod.category || (cats[0] ? cats[0]._id : '')
        );
        setPrice(prod.price !== undefined && prod.price !== null ? String(prod.price) : '');
        setCompareAtPrice(prod.compareAtPrice !== undefined && prod.compareAtPrice !== null ? String(prod.compareAtPrice) : '');
        setStock(prod.stock !== undefined && prod.stock !== null ? String(prod.stock) : '0');
        setBrand(prod.brand || 'OSMIUM');
        setSubcategory(prod.subcategory || '');
        setStatus(prod.status || 'active');
        setImageUrl(Array.isArray(prod.images) && prod.images[0] ? prod.images[0] : '');
        setDescription(prod.description || '');

        if (prod.attributes) {
          let attrList = [];
          if (typeof prod.attributes === 'object' && prod.attributes !== null) {
            attrList = Object.entries(prod.attributes).map(([key, value]) => ({
              key,
              value: String(value),
            }));
          }
          setAttributes(attrList);
        }
      }
      setIsLoading(false);
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const handleRemoveAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      setFormError('Price must be a valid number');
      setIsSaving(false);
      return;
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock)) {
      setFormError('Stock quantity must be a valid number');
      setIsSaving(false);
      return;
    }

    const parsedComparePrice = compareAtPrice && !isNaN(parseFloat(compareAtPrice)) ? parseFloat(compareAtPrice) : null;

    const attrMap = {};
    attributes.forEach((item) => {
      if (item.key.trim() && item.value.trim()) {
        attrMap[item.key.trim()] = item.value.trim();
      }
    });

    const updatePayload = {
      name,
      sku,
      category,
      price: parsedPrice,
      compareAtPrice: parsedComparePrice,
      stock: parsedStock,
      brand,
      subcategory,
      status,
      images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      description,
      attributes: attrMap,
    };

    const res = await updateProductAdmin(id, updatePayload);
    setIsSaving(false);

    if (res.success) {
      setToastMessage('Product changes saved successfully');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } else {
      setFormError(res.error || 'Failed to update product');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-3xl">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <Link href="/admin/products" className="text-xs font-mono text-secondary hover:text-cyan flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> BACK TO PRODUCTS
          </Link>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Edit Product — {name}</h1>
        </div>
      </div>

      <Card elevated>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {formError && (
              <div className="p-3 bg-error/10 border border-error/30 rounded text-xs font-mono text-error">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="SKU Code" value={sku} onChange={(e) => setSku(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Catalog Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categories.map((c) => ({ value: c._id, label: c.name }))}
                required
              />
              <Input label="Subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
              <Select
                label="Product Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Price ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              <Input label="Compare Price ($)" type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} />
              <Input label="Stock Quantity" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-secondary uppercase">Product Image</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <label className="cursor-pointer bg-elevated hover:bg-border text-primary text-xs font-mono px-3 py-2 rounded border border-border flex items-center justify-center gap-1.5 shrink-0 self-end mb-0.5">
                    <Upload className="w-3.5 h-3.5 text-cyan" /> {isUploading ? 'UPLOADING...' : 'UPLOAD'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="hidden" />
                  </label>
                </div>
              </div>
              <Input label="Brand / Atelier" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-secondary uppercase">Product Description</label>
              <textarea
                className="w-full bg-obsidian text-primary border border-border rounded-md px-3.5 py-2 text-sm min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-secondary uppercase">DYNAMIC ATTRIBUTES / SPECS</span>
                <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={handleAddAttribute}>
                  ADD ATTRIBUTE
                </Button>
              </div>

              {attributes.map((attr, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input value={attr.key} onChange={(e) => handleAttributeChange(idx, 'key', e.target.value)} />
                  <Input value={attr.value} onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)} />
                  <button type="button" onClick={() => handleRemoveAttribute(idx)} className="text-secondary hover:text-error p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isSaving} icon={Save} className="mt-4">
              UPDATE & SAVE CHANGES
            </Button>

          </form>
        </CardContent>
      </Card>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast type="success" title="Catalog Updated" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}

    </div>
  );
}
