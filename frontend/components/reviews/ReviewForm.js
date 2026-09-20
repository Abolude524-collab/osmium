'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import { Star, MessageSquare } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { user, token } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!user || !token) {
    return (
      <div className="p-4 rounded border border-border bg-obsidian text-center font-mono text-xs text-secondary">
        Please <a href="/login" className="text-cyan underline">sign in</a> to submit a customer review for this product.
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
          <span>WRITE A CUSTOMER REVIEW</span>
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
