'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

/**
 * OSMIUM Drawer Component (React Portal enabled)
 */
export const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
  className,
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

  const positionStyles = {
    right: 'right-0 top-0 bottom-0 w-full sm:w-96 border-l border-border',
    left: 'left-0 top-0 bottom-0 w-full sm:w-80 border-r border-border',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-obsidian/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div
        className={cn(
          'fixed bg-graphite shadow-2xl flex flex-col z-10 p-6 transition-transform duration-300 ease-in-out',
          positionStyles[position],
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            {title && <h2 className="text-lg font-bold text-primary tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs text-secondary font-mono mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-cyan p-1.5 rounded-md hover:bg-elevated transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
