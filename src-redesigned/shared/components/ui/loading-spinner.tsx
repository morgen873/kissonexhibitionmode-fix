import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  variant?: 'default' | 'fullscreen' | 'inline' | 'overlay';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const variantClasses = {
  default: 'flex items-center justify-center p-4',
  fullscreen: 'fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50',
  inline: 'inline-flex items-center',
  overlay: 'absolute inset-0 bg-black/50 flex items-center justify-center z-10',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'default',
  size = 'md',
  text,
  className,
}) => {
  return (
    <div className={cn(variantClasses[variant], className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Specialized loading components for common use cases
export const PageLoadingSpinner: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <LoadingSpinner variant="fullscreen" size="lg" text={text} />
);

export const InlineLoadingSpinner: React.FC<{ text?: string }> = ({ text }) => (
  <LoadingSpinner variant="inline" size="sm" text={text} />
);

export const OverlayLoadingSpinner: React.FC<{ text?: string }> = ({ text }) => (
  <LoadingSpinner variant="overlay" size="md" text={text} />
);