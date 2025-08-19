import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/useToast';
import { cn } from '@/shared/utils/cn';

/**
 * Landing page feature with interactive video background
 * Optimized for touch displays and accessibility
 */
const LandingFeature: React.FC = memo(() => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flameInteractions, setFlameInteractions] = useState(0);

  const handleEnter = () => {
    navigate('/creation');
  };

  const handleFlameTouch = (flameId: 'left' | 'right') => {
    setFlameInteractions(prev => prev + 1);
    
    toast({
      title: "OUCH! BE CAREFUL!",
      description: "WARNING HOT SURFACE!",
      duration: 2000,
      className: "text-center",
    });

    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden">
      {/* Full screen video background */}
      <div className="flex-1 relative">
        <video
          src="https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/stove.mp4"
          className="w-full h-full object-cover"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          autoPlay
          muted
          loop
          playsInline
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video ready to play')}
          onError={(e) => console.error('Video error:', e)}
        />

        {/* Interactive flame zones - positioned over video flames */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left flame interaction area */}
          <InteractiveFlameZone
            position={{ top: '50%', left: '30%' }}
            onTouch={() => handleFlameTouch('left')}
            ariaLabel="Left flame - interactive hot zone"
          />

          {/* Right flame interaction area */}
          <InteractiveFlameZone
            position={{ top: '50%', right: '20%' }}
            onTouch={() => handleFlameTouch('right')}
            ariaLabel="Right flame - interactive hot zone"
          />
        </div>

        {/* Accessibility overlay for screen readers */}
        <div className="sr-only">
          <h1>Kiss on Exhibition Mode - Interactive Cooking Experience</h1>
          <p>
            Welcome to an immersive cooking experience. 
            A video of cooking flames is displayed. 
            You can interact with the flame areas to trigger responses, 
            then enter the recipe creation experience.
          </p>
        </div>
      </div>

      {/* Enter button - optimized for touch */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <Button
          onClick={handleEnter}
          size="lg"
          className={cn(
            'bg-primary hover:bg-primary/90 text-primary-foreground',
            'font-bold transition-all duration-300 transform',
            'hover:scale-105 active:scale-95',
            'px-12 py-6 text-xl',
            'touch-manipulation', // Optimize for touch
            'shadow-2xl shadow-black/50'
          )}
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            minWidth: '200px',
            minHeight: '60px', // Ensure minimum touch target size
          }}
        >
          ENTER EXPERIENCE
        </Button>
        
        {flameInteractions > 0 && (
          <p className="text-orange-400 text-sm mt-2 animate-pulse">
            Flame interactions: {flameInteractions}
          </p>
        )}
      </div>
    </div>
  );
});

/**
 * Interactive flame zone component
 * Provides visual feedback and accessibility features
 */
interface InteractiveFlameZoneProps {
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  onTouch: () => void;
  ariaLabel: string;
}

const InteractiveFlameZone: React.FC<InteractiveFlameZoneProps> = memo(({
  position,
  onTouch,
  ariaLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={cn(
        'absolute w-60 h-60 pointer-events-auto',
        'rounded-full transition-all duration-200',
        'focus:outline-none focus:ring-4 focus:ring-orange-500/50',
        'active:scale-95',
        isHovered ? 'bg-orange-500/20' : 'hover:bg-orange-500/10'
      )}
      style={{
        ...position,
        transform: position.left ? 'translate(-50%, -50%)' : 'translate(50%, -50%)',
        minWidth: '60px', // Minimum touch target
        minHeight: '60px',
      }}
      onClick={onTouch}
      onTouchStart={onTouch}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    />
  );
});

InteractiveFlameZone.displayName = 'InteractiveFlameZone';
LandingFeature.displayName = 'LandingFeature';

export default LandingFeature;