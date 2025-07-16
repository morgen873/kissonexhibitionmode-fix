import React from 'react';

interface FuturisticBackgroundProps {
  children?: React.ReactNode;
  variant?: 'landing' | 'creation' | 'minimal';
  className?: string;
}

const FuturisticBackground: React.FC<FuturisticBackgroundProps> = ({ 
  children, 
  variant = 'landing',
  className = '' 
}) => {
  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${className}`}>
      {/* Deep space gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-space-900 via-deep-space-800 to-deep-space-900" />
      
      {/* Animated geometric grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] animate-energy-wave" />
      </div>
      
      {/* Holographic light streaks */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top-left to bottom-right diagonal light */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-electric-cyan-400/30 via-transparent to-transparent rounded-full blur-3xl animate-holographic-pulse" />
        
        {/* Bottom-right organic glow */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-holographic-purple-500/20 via-transparent to-transparent rounded-full blur-3xl animate-organic-flow" />
        
        {/* Center ambient glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-organic-amber-500/10 via-transparent to-transparent blur-3xl" />
      </div>
      
      {/* Floating geometric particles */}
      {variant === 'landing' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-primary/60 rounded-sm animate-[float_${6 + (i % 3)}s_ease-in-out_infinite]`}
              style={{
                left: `${10 + (i * 7) % 80}%`,
                top: `${15 + (i * 11) % 70}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Content overlay */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
      
      {/* Holographic overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent pointer-events-none animate-energy-wave" />
    </div>
  );
};

export default FuturisticBackground;