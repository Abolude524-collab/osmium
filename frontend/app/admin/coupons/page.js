'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Tag, Plus, CheckCircle2, XCircle, Trash2, Calendar, DollarSign, Percent, AlertCircle } from 'lucide-react';

export default function AdminCouponsPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form State for creating a new coupon
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    expirationDate: '',
    usageLimit: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchCoupons();
  }, [token, user]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCoupons(data.data);
      } else {
        setError(data.message || 'Failed to load coupons');
      }
    } catch (err) {
      setError('Network error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/coupons/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } catch (err) {
      alert('Failed to toggle coupon status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      alert('Failed to delete coupon');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/coupons`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(false);
        setFormData({
          code: '',
          discountType: 'percentage',
          discountValue: '',
          minPurchaseAmount: '',
          maxDiscountAmount: '',
          expirationDate: '',
          usageLimit: '',
        });
        fetchCoupons();
      } else {
        setFormError(data.message || 'Failed to create coupon');
      }
    } catch (err) {
      setFormError('Network error trying to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E5FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="w-7 h-7 text-[#00E5FF]" />
              <h1 className="text-3xl font-extrabold tracking-tight font-heading">
                PROMO CODES & COUPONS
              </h1>
            </div>
            <p className="text-sm text-[#8B949E] mt-1 font-mono">
              Manage discount campaigns, minimum spend thresholds, and usage limits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[#1E293B] bg-[#111820] text-[#E6EDF3] hover:border-[#00E5FF]/40 transition-colors"
            >
              ← Back to Admin
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#00E5FF] text-[#0B0F14] hover:bg-[#00B8D4] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
            >
              <Plus className="w-4 h-4" />
              Create Coupon
            </button>
          </div>
        </div>

        {/* Coupon List Table */}
        <div className="bg-[#111820] border border-[#1E293B] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-6 border-b border-[#1E293B] flex justify-between items-center">
            <h2 className="text-lg font-bold font-heading text-[#E6EDF3]">ACTIVE & INACTIVE PROMO CODES</h2>
            <span className="text-xs font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded-full border border-[#00E5FF]/20">
              {coupons.length} Total Codes
            </span>
          </div>

          {coupons.length === 0 ? (
            <div className="py-16 text-center text-[#8B949E]">
              <Tag className="w-12 h-12 text-[#1E293B] mx-auto mb-3" />
              <p className="text-base font-semibold">No promotional coupons created yet.</p>
              <p className="text-xs font-mono mt-1">Click "Create Coupon" above to add your first discount code.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#17212B] text-xs font-mono text-[#8B949E] uppercase tracking-wider border-b border-[#1E293B]">
                    <th className="py-3.5 px-4 sm:px-6">CODE</th>
                    <th className="py-3.5 px-4 sm:px-6">DISCOUNT</th>
                    <th className="py-3.5 px-4 sm:px-6">MIN SPEND</th>
                    <th className="py-3.5 px-4 sm:px-6">EXPIRATION</th>
                    <th className="py-3.5 px-4 sm:px-6">USAGE</th>
                    <th className="py-3.5 px-4 sm:px-6">STATUS</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] text-sm">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-[#17212B]/50 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-[#00E5FF]">
                        {coupon.code}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-medium text-[#E6EDF3]">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `₦${coupon.discountValue.toLocaleString()} OFF`}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-[#8B949E]">
                        {coupon.minPurchaseAmount > 0
                          ? `₦${coupon.minPurchaseAmount.toLocaleString()}`
                          : 'No Minimum'}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-[#8B949E]">
                        {new Date(coupon.expirationDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-[#8B949E]">
                        {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'uses'}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <button
                          onClick={() => handleToggleStatus(coupon._id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold transition-colors ${
                            coupon.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          }`}
                        >
                          {coupon.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-1.5 text-[#8B949E] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Coupon Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#111820] border border-[#1E293B] rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-[#1E293B] pb-4">
                <h3 className="text-xl font-bold font-heading text-[#E6EDF3] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#00E5FF]" />
                  CREATE PROMO CODE
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#8B949E] hover:text-[#E6EDF3] text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SAVE20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-[#17212B] border border-[#1E293B] rounded-lg px-3.5 py-2 text-sm text-[#E6EDF3] font-mono focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">
                      Discount Type
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full bg-[#17212B] border border-[#1E293B] rounded-lg px-3.5 py-2 text-sm text-[#E6EDF3] focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₦)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">
                      Value *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder={formData.discountType === 'percentage' ? '20' : '5000'}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full bg-[#17212B] border border-[#1E293B] rounded-lg px-3.5 py-2 text-sm text-[#E6EDF3] font-mono focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">
                      Min Spend (₦)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.minPurchaseAmount}
                      onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                      className="w-full bg-[#17212B] border border-[#1E293B] rounded-lg px-3.5 py-2 text-sm text-[#E6EDF3] font-mono focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">
                      Expiration Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.expirationDate}
                      onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                      className="w-full bg-[#17212B] border border-[#1E293B] rounded-lg px-3.5 py-2 text-sm text-[#E6EDF3] font-mono focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">
                    Usage Limit (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Unlimited if left empty"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full bg-[#17212B] border border-[#1E293B] rounded-lg px-3.5 py-2 text-sm text-[#E6EDF3] font-mono focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm rounded-lg border border-[#1E293B] bg-[#17212B] text-[#8B949E] hover:text-[#E6EDF3]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#00E5FF] text-[#0B0F14] hover:bg-[#00B8D4] disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Save Promo Code'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
