
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const StandbyLanding: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flameInteractions, setFlameInteractions] = useState(0);

  const handleEnter = () => {
    navigate('/creation');
  };

  const handleFlameTouch = (flameId: string) => {
    setFlameInteractions(prev => prev + 1);
    toast({
      title: "OUCH! BE CAREFUL!",
      description: `WARNING HOT SURFACE!`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative touch-container-32">
      {/* Full screen video */}
      <div className="flex-1 relative overflow-hidden">
        <video 
          src="https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//stove.mp4" 
          className="w-full h-full object-cover touch-video" 
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          autoPlay
          muted
          loop
          playsInline
        />
        
        {/* Interactive Flame Zones - Invisible overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left flame area - adjust position based on your video */}
          <div 
            className="absolute w-60 h-60 pointer-events-auto cursor-pointer hover:bg-orange-500/20 transition-colors duration-200 rounded-full"
            style={{
              top: '50%', // Adjust these percentages based on where flames appear in your video
              left: '30%',
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleFlameTouch('left-flame')}
            onTouchStart={() => handleFlameTouch('left-flame')}
          />
          
          {/* Right flame area - adjust position based on your video */}
          <div 
            className="absolute w-60 h-60 pointer-events-auto cursor-pointer hover:bg-orange-500/20 transition-colors duration-200 rounded-full"
            style={{
              top: '30%', // Adjust these percentages based on where flames appear in your video
              right: '10%',
              transform: 'translate(50%, -50%)'
            }}
            onClick={() => handleFlameTouch('right-flame')}
            onTouchStart={() => handleFlameTouch('right-flame')}
          />
          
          {/* Center flame area - add more zones as needed */}
          <div 
            className="absolute w-24 h-28 pointer-events-auto cursor-pointer hover:bg-orange-500/20 transition-colors duration-200 rounded-full"
            style={{
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleFlameTouch('center-flame')}
            onTouchStart={() => handleFlameTouch('center-flame')}
          />
        </div>
      </div>
      
      {/* Bottom button optimized for 32-inch touch */}
      <div className="absolute bottom-8 touch:bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center touch-safe-area">
        <Button 
          onClick={handleEnter} 
          size="touch-32" 
          variant="touch"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 font-sans touch-target touch-button-32 touch-32-optimized px-8 py-4"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          ENTER EXPERIENCE
        </Button>
      </div>
    </div>
  );
};

export default StandbyLanding;
