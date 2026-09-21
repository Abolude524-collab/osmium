'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import { Star, MessageSquare, ShieldAlert, CheckCircle2, Lock, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { user, token } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [eligibility, setEligibility] = useState({ canReview: false, reason: '', message: '' });
  const [errorMsg, setErrorMsg] = useState(null);

  // Check user purchase eligibility whenever user, token, or productId changes
  useEffect(() => {
    async function verifyEligibility() {
      if (!user || !token || !productId) {
        setIsCheckingEligibility(false);
        return;
      }

      setIsCheckingEligibility(true);
      try {
        const res = await fetch(`${API_URL}/products/${productId}/reviews/eligibility`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
          setEligibility({
            canReview: data.canReview,
            reason: data.reason || '',
            message: data.message || '',
          });
        } else {
          setEligibility({
            canReview: false,
            reason: 'error',
            message: data.message || 'Unable to check review eligibility.',
          });
        }
      } catch (err) {
        console.error('[ReviewForm] Error checking eligibility:', err);
        setEligibility({
          canReview: false,
          reason: 'error',
          message: 'Unable to check purchase status.',
        });
      } finally {
        setIsCheckingEligibility(false);
      }
    }

    verifyEligibility();
  }, [user, token, productId]);

  if (!user || !token) {
    return (
      <div className="p-5 rounded-lg border border-border bg-graphite/40 text-center flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-bold text-primary tracking-wide">SIGN IN TO WRITE A REVIEW</h4>
          <p className="text-xs font-mono text-secondary">
            Reviews are restricted to verified purchasers of OSMIUM products.
          </p>
        </div>
        <Link href={`/login?redirect=/products/${productId}`}>
          <Button variant="secondary" size="sm">
            SIGN IN TO ACCOUNT
          </Button>
        </Link>
      </div>
    );
  }

  if (isCheckingEligibility) {
    return (
      <div className="p-6 rounded-lg border border-border bg-graphite/30 flex items-center justify-center gap-2 text-xs font-mono text-secondary">
        <Loader2 className="w-4 h-4 text-cyan animate-spin" />
        <span>Verifying purchase history...</span>
      </div>
    );
  }

  if (!eligibility.canReview) {
    if (eligibility.reason === 'already_reviewed') {
      return (
        <div className="p-5 rounded-lg border border-cyan/30 bg-cyan/5 flex items-center gap-4">
          <CheckCircle2 className="w-6 h-6 text-cyan shrink-0" />
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-bold text-primary">REVIEW SUBMITTED</h4>
            <p className="text-xs font-mono text-secondary">
              You have already reviewed this product. Thank you for your feedback!
            </p>
          </div>
        </div>
      );
    }

    // Default: Not purchased yet
    return (
      <div className="p-5 rounded-lg border border-border bg-graphite/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-warning/10 border border-warning/30 text-warning flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-primary tracking-wide">VERIFIED PURCHASE REQUIRED</h4>
            <p className="text-xs font-mono text-secondary max-w-lg leading-relaxed">
              Only customers who have successfully purchased and received this product can write a review.
            </p>
          </div>
        </div>

        <Link href="/orders">
          <Button variant="outline" size="sm" className="shrink-0">
            MY ORDERS
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please enter a review comment');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          title,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Failed to submit review');
      }

      setTitle('');
      setComment('');
      setEligibility({
        canReview: false,
        reason: 'already_reviewed',
        message: 'Review submitted.',
      });

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card elevated className="w-full">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-base font-mono uppercase flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan" />
          <span>WRITE A VERIFIED REVIEW</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {errorMsg && (
          <Toast
            type="error"
            title="Review Error"
            message={errorMsg}
            onClose={() => setErrorMsg(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Star Rating Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-secondary uppercase font-semibold">YOUR RATING *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-warning hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? 'fill-warning text-warning'
                        : 'text-secondary/30'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono text-cyan font-bold ml-2">
                {hoverRating || rating} / 5 Stars
              </span>
            </div>
          </div>

          <Input
            label="Review Title (Optional)"
            placeholder="e.g. Exceptional build quality and audio!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-secondary uppercase font-semibold">YOUR REVIEW *</label>
            <textarea
              rows={4}
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-md bg-obsidian border border-border text-primary text-sm focus:border-cyan focus:ring-1 focus:ring-cyan focus:outline-none transition-all placeholder:text-secondary/50 font-sans"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="self-end"
          >
            SUBMIT REVIEW
          </Button>

        </form>
      </CardContent>
    </Card>
  );
};
