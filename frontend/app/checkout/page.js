'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Toast } from '@/components/ui/Toast';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Lock,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getItemCount } = useCartStore();
  const { user, token, fetchProfile } = useAuthStore();

  const [shippingOption, setShippingOption] = useState('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Authoritative Totals calculated from Server
  const [serverTotals, setServerTotals] = useState({
    subtotal: getSubtotal(),
    tax: getSubtotal() * 0.08,
    shippingPrice: getSubtotal() > 150 ? 0 : 15,
    discountAmount: 0,
    totalAmount: getSubtotal() * 1.08 + (getSubtotal() > 150 ? 0 : 15),
  });

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!user && token) {
      fetchProfile();
    }
  }, [user, token, fetchProfile]);

  useEffect(() => {
    if (user && !formData.fullName) {
      setFormData((prev) => ({ ...prev, fullName: user.name }));
    }
  }, [user]);

  // Server Authoritative Price Calculation
  useEffect(() => {
    if (items.length === 0) return;

    const validateCart = async () => {
      setIsValidating(true);
      try {
        const payload = {
          items: items.map((i) => ({
            productId: i.product._id,
            quantity: i.quantity,
          })),
          shippingOption,
          couponCode: appliedCouponCode || undefined,
        };

        const res = await fetch(`${API_URL}/checkout/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.status === 'success') {
          setServerTotals(data.data);
          setErrorMsg(null);
        } else {
          setErrorMsg(data.message || 'Error calculating order totals');
        }
      } catch (err) {
        console.error('Validation error:', err);
      } finally {
        setIsValidating(false);
      }
    };

    validateCart();
  }, [items, shippingOption, appliedCouponCode]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMsg(null);

    try {
      const res = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim(),
          subtotal: serverTotals.subtotal,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCouponCode(data.data.code);
        setCouponMsg({ type: 'success', text: data.message });
      } else {
        setCouponMsg({ type: 'error', text: data.message || 'Invalid coupon code' });
      }
    } catch (err) {
      setCouponMsg({ type: 'error', text: 'Network error validating coupon' });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.streetAddress.trim()) errors.streetAddress = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State / Province is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaystackCheckout = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      setErrorMsg('Please log in or register to complete your order.');
      return;
    }

    if (!validateForm()) {
      setErrorMsg('Please complete all required shipping address fields.');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Your shopping cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
        shippingOption,
        shippingAddress: formData,
        couponCode: appliedCouponCode || undefined,
      };

      const res = await fetch(`${API_URL}/checkout/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        if (res.status === 401) {
          useAuthStore.getState().logout();
          throw new Error('Your session has expired because security keys were updated. Please log in again to complete checkout.');
        }
        throw new Error(data.message || 'Paystack initialization failed.');
      }

      const { authorization_url } = data.data;

      // Direct user to Paystack Payment Page
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        throw new Error('No Paystack authorization URL received.');
      }
    } catch (err) {
      setErrorMsg(err.message);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <h1 className="text-2xl font-bold text-primary">Your cart is empty</h1>
        <p className="text-secondary text-sm">Add products to your cart before proceeding to checkout.</p>
        <Link href="/products">
          <Button variant="primary" icon={ArrowRight}>
            BROWSE PRODUCTS
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-widest text-cyan uppercase">CHECKOUT STEP 2 OF 2</span>
          <Badge variant="accent" size="sm">PAYSTACK GATEWAY</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">Shipping & Payment</h1>
        <p className="text-sm text-secondary">
          Enter your delivery details and proceed to Paystack secure payment.
        </p>
      </div>

      {errorMsg && (
        <Toast
          type="error"
          title="Checkout Error"
          message={errorMsg}
          onClose={() => setErrorMsg(null)}
        />
      )}

      {/* Unauthenticated Alert Banner */}
      {!user && (
        <div className="p-4 rounded border border-warning/40 bg-warning/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary">Account Required for Order Tracking</span>
              <span className="text-xs text-secondary">
                Please log in or register so your order receipt and tracking will be saved to your profile.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/login?redirect=/checkout">
              <Button variant="primary" size="sm">LOG IN</Button>
            </Link>
            <Link href="/register?redirect=/checkout">
              <Button variant="outline" size="sm">REGISTER</Button>
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handlePaystackCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Address & Delivery Option */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 1. Shipping Address Card */}
          <Card elevated>
            <CardHeader className="pb-4 border-b border-border flex flex-row items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan font-mono text-xs font-bold">
                1
              </div>
              <CardTitle className="text-lg font-bold text-primary">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  error={formErrors.fullName}
                  icon={User}
                />

                <Input
                  label="Phone Number *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 800 000 0000"
                  error={formErrors.phone}
                  icon={Phone}
                />
              </div>

              <Input
                label="Street Address *"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                placeholder="123 Innovation Boulevard, Suite 400"
                error={formErrors.streetAddress}
                icon={MapPin}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City *"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Ikeja / Lagos"
                  error={formErrors.city}
                />

                <Input
                  label="State / Province *"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Lagos State"
                  error={formErrors.state}
                />

                <Input
                  label="Postal Code *"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="100001"
                  error={formErrors.postalCode}
                />
              </div>

              <Select
                label="Country *"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                options={[
                  { value: 'Nigeria', label: 'Nigeria' },
                  { value: 'Ghana', label: 'Ghana' },
                  { value: 'Kenya', label: 'Kenya' },
                  { value: 'South Africa', label: 'South Africa' },
                  { value: 'United States', label: 'United States' },
                  { value: 'United Kingdom', label: 'United Kingdom' },
                ]}
              />
            </CardContent>
          </Card>

          {/* 2. Shipping Method Selection */}
          <Card elevated>
            <CardHeader className="pb-4 border-b border-border flex flex-row items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan font-mono text-xs font-bold">
                2
              </div>
              <CardTitle className="text-lg font-bold text-primary">Delivery Method</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-3">
              
              <label
                onClick={() => setShippingOption('standard')}
                className={`p-4 rounded border transition-all cursor-pointer flex items-center justify-between ${
                  shippingOption === 'standard'
                    ? 'border-cyan bg-cyan/5 text-primary'
                    : 'border-border bg-obsidian text-secondary hover:border-border/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingOption"
                    value="standard"
                    checked={shippingOption === 'standard'}
                    onChange={() => setShippingOption('standard')}
                    className="accent-cyan"
                  />
                  <Truck className="w-5 h-5 text-cyan" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary">Standard Shipping</span>
                    <span className="text-xs text-secondary">3-5 business days delivery</span>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-primary">
                  {getSubtotal() > 150 ? 'FREE' : formatCurrency(15)}
                </span>
              </label>

              <label
                onClick={() => setShippingOption('express')}
                className={`p-4 rounded border transition-all cursor-pointer flex items-center justify-between ${
                  shippingOption === 'express'
                    ? 'border-cyan bg-cyan/5 text-primary'
                    : 'border-border bg-obsidian text-secondary hover:border-border/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingOption"
                    value="express"
                    checked={shippingOption === 'express'}
                    onChange={() => setShippingOption('express')}
                    className="accent-cyan"
                  />
                  <Truck className="w-5 h-5 text-cyan" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary">Express Priority Shipping</span>
                    <span className="text-xs text-secondary">1-2 business days expedited delivery</span>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-primary">{formatCurrency(25)}</span>
              </label>

            </CardContent>
          </Card>

        </div>

        {/* Right Column: Authoritative Order Summary & Paystack CTA */}
        <div className="flex flex-col gap-4">
          <Card elevated className="sticky top-24">
            <CardHeader className="pb-3 border-b border-border flex justify-between items-center">
              <CardTitle className="text-base font-bold uppercase tracking-wider font-mono">ORDER SUMMARY</CardTitle>
              {isValidating && <Loader2 className="w-4 h-4 text-cyan animate-spin" />}
            </CardHeader>

            <CardContent className="pt-4 flex flex-col gap-4">
              
              {/* Items Brief */}
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 divide-y divide-border/40">
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="pt-2 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="font-mono text-cyan shrink-0">{quantity}x</span>
                      <span className="text-primary truncate">{product.name}</span>
                    </div>
                    <span className="font-mono text-secondary shrink-0">{formatCurrency(product.price * quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE (e.g. SAVE20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-obsidian border border-border rounded px-3 py-1.5 text-xs font-mono text-primary uppercase focus:outline-none focus:border-cyan"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    type="button"
                    className="px-3 py-1.5 rounded bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono font-bold hover:bg-cyan hover:text-obsidian disabled:opacity-50 transition-all"
                  >
                    {isApplyingCoupon ? '...' : 'APPLY'}
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-[11px] font-mono ${couponMsg.type === 'success' ? 'text-success' : 'text-error'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-border flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-secondary">Subtotal</span>
                  <span className="text-primary font-semibold">{formatCurrency(serverTotals.subtotal)}</span>
                </div>
                {serverTotals.discountAmount > 0 && (
                  <div className="flex justify-between text-success font-semibold">
                    <span>Discount ({appliedCouponCode})</span>
                    <span>-{formatCurrency(serverTotals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-secondary">Estimated Tax (8%)</span>
                  <span className="text-primary font-semibold">{formatCurrency(serverTotals.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Shipping ({shippingOption.toUpperCase()})</span>
                  <span className="text-primary font-semibold">
                    {serverTotals.shippingPrice === 0 ? 'FREE' : formatCurrency(serverTotals.shippingPrice)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-baseline font-mono">
                <span className="text-sm font-bold text-primary">PAYMENT TOTAL</span>
                <span className="text-2xl font-extrabold text-cyan">
                  {formatCurrency(serverTotals.totalAmount)}
                </span>
              </div>

              {/* Paystack CTA Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting || !user}
                icon={CreditCard}
                className="w-full mt-2"
              >
                {isSubmitting ? 'INITIALIZING PAYSTACK...' : 'PAY WITH PAYSTACK'}
              </Button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-secondary font-mono">
                <Lock className="w-3.5 h-3.5 text-success" />
                <span>256-bit Encrypted Paystack Payment</span>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <Link href="/cart" className="inline-flex items-center gap-1 font-mono text-secondary hover:text-cyan">
                  <ArrowLeft className="w-3.5 h-3.5" /> BACK TO CART
                </Link>
              </div>

            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
