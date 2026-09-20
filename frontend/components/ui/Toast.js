import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

/**
 * OSMIUM Toast Alert Component
 */
export const Toast = ({
  title,
  message,
  type = 'info',
  onClose,
  className,
}) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-error shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan shrink-0" />,
  };

  const borders = {
    success: 'border-success/40',
    warning: 'border-warning/40',
    error: 'border-error/40',
    info: 'border-cyan/40',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 bg-graphite border rounded-md p-4 shadow-subtle max-w-sm w-full transition-all duration-200',
        borders[type],
        className
      )}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-semibold text-primary">{title}</h4>}
        {message && <p className="text-xs text-secondary mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-secondary hover:text-primary p-0.5 rounded transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
