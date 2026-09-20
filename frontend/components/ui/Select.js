import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

/**
 * OSMIUM Select Dropdown Component
 */
export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  className,
  id,
  placeholder = 'Select an option...',
  disabled = false,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={selectId}
          className="text-xs font-mono tracking-wider text-secondary uppercase select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full bg-obsidian text-primary border border-border rounded-md px-3.5 py-2 pr-10 text-sm appearance-none cursor-pointer transition-all duration-150',
            'focus:border-cyan focus:ring-1 focus:ring-cyan focus:outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-graphite text-primary">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 text-secondary pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <span className="text-xs font-mono text-error mt-0.5">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
