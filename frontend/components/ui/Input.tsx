import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon: Icon,
  className,
  id,
  type = 'text',
  disabled = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const isPasswordInput = type === 'password';
  const effectiveType = isPasswordInput ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={inputId}
          className="text-xs font-mono tracking-wider text-secondary uppercase select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-secondary pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          type={effectiveType}
          disabled={disabled}
          className={cn(
            'w-full bg-obsidian text-primary border border-border rounded-md px-3.5 py-2 text-sm transition-all duration-150',
            'placeholder:text-secondary/50 focus:border-cyan focus:ring-1 focus:ring-cyan focus:outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-9',
            isPasswordInput && 'pr-10',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {isPasswordInput && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="absolute right-3 text-secondary hover:text-cyan p-0.5 rounded transition-colors focus:outline-none"
            title={showPassword ? 'Hide password' : 'Reveal password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4 text-cyan" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error ? (
        <span className="text-xs font-mono text-error mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-secondary mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
