"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Loading.displayName = 'Loading';

export { Loading };

// Loading Spinner Component
export function LoadingSpinner({ 
  size = 'md', 
  className 
}: LoadingProps) {
  return (
    <div className="flex items-center justify-center">
      <Loading size={size} className={className} />
    </div>
  );
}

// Loading Skeleton Component
export function LoadingSkeleton({ 
  className 
}: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
    />
  );
}

// Loading Card Skeleton
export function LoadingCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <LoadingSkeleton className="h-48 w-full mb-4" />
      <LoadingSkeleton className="h-4 w-3/4 mb-2" />
      <LoadingSkeleton className="h-4 w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-6 w-16" />
        <LoadingSkeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Full Page Loading
export function FullPageLoading({ 
  message = 'Loading...' 
}: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50">
      <Loading size="lg" className="mb-4" />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}

// Button Loading State
export function ButtonLoading({ 
  text = 'Loading...' 
}: { text?: string }) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loading size="sm" />
      <span>{text}</span>
    </div>
  );
}
