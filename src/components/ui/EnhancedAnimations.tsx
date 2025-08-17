
import React from 'react';
import { VideoLoadingSpinner } from './VideoLoadingSpinner';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'bounce' | 'flip';
  delay?: number;
  duration?: 'fast' | 'normal' | 'slow';
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  variant = 'fade',
  delay = 0,
  duration = 'normal'
}) => {
  const durationClasses = {
    fast: 'duration-200',
    normal: 'duration-300',
    slow: 'duration-500'
  };

  const variantClasses = {
    fade: 'animate-fade-in',
    slide: 'animate-slide-morph-in',
    scale: 'animate-morph-in',
    bounce: 'animate-bounce-in',
    flip: 'animate-flip-in'
  };

  return (
    <div 
      className={`${variantClasses[variant]} ${durationClasses[duration]} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className = '',
  staggerDelay = 100
}) => {
  return (
    <div className={`stagger-children ${className}`}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-stagger-in"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'pulse' | 'glow' | 'lift' | 'ripple';
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'lift',
  disabled = false
}) => {
  const variantClasses = {
    pulse: 'hover:animate-pulse active:scale-95',
    glow: 'hover:animate-neon-glow active:scale-95',
    lift: 'hover:scale-105 hover:-translate-y-1 active:scale-95',
    ripple: 'hover:animate-psychedelic-pulse active:scale-95'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        transition-all duration-200 ease-out
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  variant?: 'spin' | 'pulse' | 'bounce' | 'dots';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-green-400',
  variant = 'spin'
}) => {
  // Use video spinner for recipe creation
  if (variant === 'spin' && size === 'lg') {
    return <VideoLoadingSpinner size={size} />;
  }
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (variant === 'dots') {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${sizeClasses.sm} ${color} bg-current rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  const variantClasses = {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce'
  };

  return (
    <div className={`${sizeClasses[size]} ${color} ${variantClasses[variant]}`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const GlitchText: React.FC<{ children: string; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <span 
      className={`text-glitch ${className}`} 
      data-text={children}
    >
      {children}
    </span>
  );
};
