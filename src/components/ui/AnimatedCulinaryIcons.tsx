
import React from 'react';

interface AnimatedIconProps {
  className?: string;
}

export const AnimatedEggIcon: React.FC<AnimatedIconProps> = ({ className = "" }) => (
  <div className={`animate-float ${className}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="15" rx="6" ry="8" className="animate-pulse"/>
    </svg>
  </div>
);

export const AnimatedLeafIcon: React.FC<AnimatedIconProps> = ({ className = "" }) => (
  <div className={`animate-float ${className}`} style={{ animationDelay: '0.5s' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" className="animate-pulse"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" className="animate-pulse"/>
    </svg>
  </div>
);

export const AnimatedChefHatIcon: React.FC<AnimatedIconProps> = ({ className = "" }) => (
  <div className={`animate-float ${className}`} style={{ animationDelay: '1s' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" className="animate-pulse"/>
      <path d="M6 17h12" className="animate-pulse"/>
    </svg>
  </div>
);

export const AnimatedCarrotIcon: React.FC<AnimatedIconProps> = ({ className = "" }) => (
  <div className={`animate-float ${className}`} style={{ animationDelay: '1.5s' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46" className="animate-pulse"/>
      <path d="M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z" className="animate-pulse"/>
      <path d="M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5S15 2 15 2z" className="animate-pulse"/>
    </svg>
  </div>
);

export const AnimatedAppleIcon: React.FC<AnimatedIconProps> = ({ className = "" }) => (
  <div className={`animate-float ${className}`} style={{ animationDelay: '2s' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" className="animate-pulse"/>
      <path d="M10 2c1 .5 2 2 2 5" className="animate-pulse"/>
    </svg>
  </div>
);
