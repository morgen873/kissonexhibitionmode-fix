
import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/EnhancedAnimations';

interface TransitionAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  direction?: 'forward' | 'backward';
  variant?: 'geometric' | 'particle' | 'wave' | 'minimal' | 'loading';
}

const TransitionAnimation: React.FC<TransitionAnimationProps> = ({
  isVisible,
  onComplete,
  direction = 'forward',
  variant = 'geometric'
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Preserved dumpling images for future use (not currently active)
  const dumplingImages = [
    '/lovable-uploads/9e669733-5c8a-4971-926a-51a8a6711aca.png',
    '/lovable-uploads/504c7d32-e678-4269-92bd-2bcbb41ed83d.png',
    '/lovable-uploads/35e09118-6751-4e82-addf-f64a1c994622.png',
    '/lovable-uploads/630333bc-01ff-4495-b5d9-812404b6e842.png'
  ];

  useEffect(() => {
    if (!isVisible) {
      setIsAnimating(false);
      setAnimationPhase(0);
      return;
    }

    setIsAnimating(true);
    console.log('TransitionAnimation: Starting new animation variant:', variant);
    
    if (variant === 'minimal') {
      setTimeout(() => {
        console.log('TransitionAnimation: Minimal transition complete');
        onComplete();
      }, 400);
      return;
    }

    if (variant === 'loading') {
      setTimeout(() => {
        console.log('TransitionAnimation: Loading transition complete');
        onComplete();
      }, 800);
      return;
    }

    // New animation sequences
    let timeouts: NodeJS.Timeout[] = [];
    const phases = variant === 'geometric' ? 4 : variant === 'particle' ? 5 : 3;
    const phaseTime = 350;
    const totalDuration = phases * phaseTime + 200;

    for (let i = 0; i < phases; i++) {
      timeouts.push(setTimeout(() => {
        console.log(`TransitionAnimation: Phase ${i + 1} of ${variant} animation`);
        setAnimationPhase(i);
      }, i * phaseTime));
    }

    timeouts.push(setTimeout(() => {
      console.log('TransitionAnimation: New animation sequence complete');
      setIsAnimating(false);
      onComplete();
    }, totalDuration));

    return () => {
      timeouts.forEach(clearTimeout);
      setIsAnimating(false);
      setAnimationPhase(0);
    };
  }, [isVisible, onComplete, variant]);

  if (!isVisible) return null;

  if (variant === 'minimal') {
    return (
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center animate-fade-in"
        style={{ zIndex: 9999 }}
      >
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-green-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (variant === 'loading') {
    return (
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center animate-fade-in"
        style={{ zIndex: 9999 }}
      >
        <LoadingSpinner size="lg" variant="spin" />
        <p className="text-white text-lg font-mono mt-4 animate-pulse">
          Preparing your experience...
        </p>
      </div>
    );
  }

  // Geometric Animation
  if (variant === 'geometric') {
    return (
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden"
        style={{ zIndex: 9999 }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Animated geometric shapes */}
          <div className={`absolute transition-all duration-500 ${animationPhase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="w-32 h-32 border-4 border-green-400 rotate-45 animate-spin"></div>
          </div>
          <div className={`absolute transition-all duration-500 delay-150 ${animationPhase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="w-24 h-24 bg-green-400/20 rounded-full animate-pulse"></div>
          </div>
          <div className={`absolute transition-all duration-500 delay-300 ${animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="w-40 h-40 border-2 border-emerald-500 rounded-full animate-ping"></div>
          </div>
          <div className={`absolute transition-all duration-500 delay-450 ${animationPhase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  // Particle Animation
  if (variant === 'particle') {
    return (
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden"
        style={{ zIndex: 9999 }}
      >
        <div className="relative w-full h-full">
          {/* Animated particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 bg-green-400 rounded-full transition-all duration-700 ${
                animationPhase >= Math.floor(i / 3) ? 'opacity-100 animate-bounce' : 'opacity-0'
              }`}
              style={{
                left: `${20 + (i % 4) * 20}%`,
                top: `${20 + Math.floor(i / 4) * 20}%`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
          
          {/* Central glow effect */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
            animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <div className="w-32 h-32 bg-green-400/30 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Wave Animation (default fallback)
  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Wave effect */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute border-4 border-green-400/50 rounded-full transition-all duration-1000 ${
              animationPhase >= i ? 'opacity-100 animate-ping' : 'opacity-0'
            }`}
            style={{
              width: `${(i + 1) * 100}px`,
              height: `${(i + 1) * 100}px`,
              animationDelay: `${i * 200}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TransitionAnimation;
