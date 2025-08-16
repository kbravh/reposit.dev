import React from 'react';
import { cn } from '../../utils/cn';

interface SpinnerProps {
  show?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function Spinner({
  show = true,
  size = 'md',
  className,
  children,
}: SpinnerProps) {
  if (!show) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-solid border-current border-e-transparent',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {children && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {children}
        </span>
      )}
    </div>
  );
}
