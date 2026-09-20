import React from 'react';
import { cn } from '@/lib/utils';

/**
 * OSMIUM Skeleton Loader Primitive
 * Pulsing dark layout placeholder
 */
export const Skeleton = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-elevated/70 border border-border/30 rounded-md animate-pulse-subtle',
        className
      )}
      {...props}
    />
  );
};
