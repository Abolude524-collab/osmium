import React from 'react';
import { cn } from '@/lib/utils';

/**
 * OSMIUM Status Badge Component
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  dot = false,
}) => {
  const variants = {
    default: 'bg-elevated text-secondary border border-border',
    accent: 'bg-cyan/10 text-cyan border border-cyan/30',
    success: 'bg-success/10 text-success border border-success/30',
    warning: 'bg-warning/10 text-warning border border-warning/30',
    error: 'bg-error/10 text-error border border-error/30',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const dotColors = {
    default: 'bg-secondary',
    accent: 'bg-cyan shadow-cyan/50 shadow-sm',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono rounded-full font-medium uppercase tracking-wider select-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      <span>{children}</span>
    </span>
  );
};
