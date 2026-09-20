import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * OSMIUM Button Component
 */
export const Button = React.forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  ...props
}, ref) => {
  const isSpinnerLoading = isLoading || loading;
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-md select-none';
  
  const variants = {
    primary: 'bg-cyan text-obsidian font-semibold hover:bg-cyan-hover shadow-cyan/20 hover:shadow-cyan/40 active:scale-[0.98]',
    secondary: 'bg-graphite text-primary border border-border hover:bg-elevated hover:border-cyan/40 active:scale-[0.98]',
    outline: 'bg-transparent text-primary border border-border hover:border-cyan hover:text-cyan active:scale-[0.98]',
    ghost: 'bg-transparent text-secondary hover:text-primary hover:bg-elevated active:scale-[0.98]',
    danger: 'bg-error/20 text-error border border-error/30 hover:bg-error/30 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isSpinnerLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isSpinnerLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';
