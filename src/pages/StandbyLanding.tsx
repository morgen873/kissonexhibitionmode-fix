
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import FuturisticBackground from '@/components/ui/FuturisticBackground';

const StandbyLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/creation');
  };

  return (
    <FuturisticBackground variant="landing">
      {/* Video with holographic overlay */}
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <video 
            src="https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//stove.mp4" 
            className="w-full h-full object-cover opacity-70" 
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            autoPlay
            muted
            loop
            playsInline
          />
          
          {/* Holographic video overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep-space-900/80 via-transparent to-deep-space-900/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan-500/10 via-transparent to-holographic-purple-500/10" />
        </div>
      </div>
      
      {/* Enhanced geometric interface elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left geometric accent */}
        <div className="absolute top-8 left-8 w-32 h-32 border-l-2 border-t-2 border-primary/50 animate-geometric-slide" />
        
        {/* Bottom-right organic flow */}
        <div className="absolute bottom-8 right-8 w-40 h-40 rounded-full border-2 border-accent/30 animate-organic-flow" />
        
        {/* Center HUD elements */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-16 h-1 bg-primary/60 animate-holographic-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>
      
      {/* Enhanced enter button */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        <style>{`
          @media (min-width: 1920px) {
            .touch-landing-button {
              bottom: 4rem !important;
              font-size: 2.5rem !important;
            }
          }
        `}</style>
        
        {/* Holographic frame around button */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl animate-holographic-pulse" />
          
          <Button 
            onClick={handleEnter} 
            size="touch-lg" 
            variant="holographic"
            className="relative biomorphic-button font-geometric font-bold text-xl touch-target touch-landing-button border-2 border-primary/50 electric-glow"
          >
            <span className="relative z-10">ENTER EXPERIENCE</span>
            
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-biomorphic blur-sm animate-energy-wave" />
          </Button>
        </div>
        
        {/* Subtitle with organic styling */}
        <p className="mt-4 text-muted-foreground font-organic text-sm tracking-wider animate-holographic-pulse opacity-70">
          BIOMORPHIC INTERFACE READY
        </p>
      </div>
    </FuturisticBackground>
  );
};

export default StandbyLanding;
