import React from 'react';
import { cn } from '@/lib/utils';

/**
 * OSMIUM Card Component
 * Obsidian / Graphite surface panel with subtle crisp border
 */
export const Card = ({
  children,
  className,
  elevated = false,
  interactive = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-md border border-border p-5 transition-all duration-200',
        elevated ? 'bg-elevated' : 'bg-graphite',
        interactive && 'hover:border-cyan/40 hover:shadow-cyan/5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('flex flex-col gap-1 mb-4 pb-3 border-b border-border/50', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-lg font-semibold text-primary tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-xs text-secondary font-sans', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn('flex-1', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('mt-4 pt-3 border-t border-border/50 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
