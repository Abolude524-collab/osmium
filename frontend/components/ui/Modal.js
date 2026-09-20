'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

/**
 * OSMIUM Modal Component (React Portal enabled)
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className,
  maxWidth = 'max-w-lg',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 my-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-obsidian/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className={cn(
          'relative w-full bg-graphite border border-border rounded-md shadow-2xl z-10 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150',
          maxWidth,
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div>
            {title && <h2 className="text-lg sm:text-xl font-bold text-primary tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs text-secondary mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-cyan p-1.5 rounded-md hover:bg-elevated transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 py-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
