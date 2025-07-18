
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const StandbyLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/creation');
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col relative touch-container-32">
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
      </div>
      
      {/* Bottom button optimized for 32-inch touch */}
      <div className="absolute bottom-8 touch:bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center touch-safe-area">
        <Button 
          onClick={handleEnter} 
          size="touch-32" 
          variant="touch"
          className="bg-transparent hover:bg-transparent text-white font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 font-sans touch-target touch-button-32 touch-32-optimized"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'
          }}
        >
          ENTER EXPERIENCE
        </Button>
      </div>
    </div>
  );
};

export default StandbyLanding;
