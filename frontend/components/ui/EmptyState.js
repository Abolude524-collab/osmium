import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { PackageOpen } from 'lucide-react';

/**
 * OSMIUM Empty State Component
 */
export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no items matching your criteria at this time.',
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-12 rounded-md border border-border bg-graphite/40 gap-4',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-elevated border border-border flex items-center justify-center text-cyan">
        <Icon className="w-6 h-6" />
      </div>
      <div className="max-w-md flex flex-col gap-1">
        <h3 className="text-base font-semibold text-primary">{title}</h3>
        <p className="text-xs text-secondary leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
