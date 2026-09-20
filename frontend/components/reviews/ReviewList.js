'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Star, CheckCircle2, User } from 'lucide-react';

export const ReviewList = ({ reviews = [], summary = {} }) => {
  const { averageRating = 0, totalReviews = 0, distribution = {} } = summary;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5 text-warning">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'fill-warning text-warning'
                : 'text-secondary/30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Summary Rating Header & Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-lg border border-border bg-graphite/40">
        
        {/* Average Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border">
          <span className="text-5xl font-extrabold font-mono text-primary">{averageRating.toFixed(1)}</span>
          <div className="my-2">{renderStars(averageRating)}</div>
          <span className="text-xs font-mono text-secondary uppercase">
            {totalReviews} {totalReviews === 1 ? 'Customer Review' : 'Customer Reviews'}
          </span>
        </div>

        {/* 1-5 Star Progress Distribution Bars */}
        <div className="md:col-span-2 flex flex-col justify-center gap-2 font-mono text-xs">
          {[5, 4, 3, 2, 1].map((starCount) => {
            const count = distribution[starCount] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={starCount} className="flex items-center gap-3">
                <span className="w-12 text-secondary font-semibold shrink-0">{starCount} Stars</span>
                <div className="flex-1 h-2 rounded-full bg-obsidian border border-border/50 overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-secondary/70 shrink-0">{count}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Review List items */}
      {reviews.length === 0 ? (
        <div className="p-8 text-center border border-border rounded bg-obsidian text-xs font-mono text-secondary">
          No customer reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border/60">
          {reviews.map((review) => (
            <div key={review._id} className="py-6 flex flex-col gap-3">
              
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan font-mono text-xs font-bold">
                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary">{review.user?.name || 'Anonymous Customer'}</span>
                    {review.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-success">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED PURCHASER
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {renderStars(review.rating)}
                  <span className="text-xs font-mono text-secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {review.title && (
                <h4 className="text-base font-bold text-primary">{review.title}</h4>
              )}

              <p className="text-sm text-secondary leading-relaxed font-sans">
                {review.comment}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
