
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const StandbyLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/creation');
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col relative">
      {/* Full screen GIF */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src="https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//stove.gif" 
          alt="Cooking on stovetop" 
          className="w-full h-full object-cover" 
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }} 
        />
        
        {/* Two transparent buttons positioned over the hotplates */}
        <div className="absolute inset-0">
          {/* Left button over left hotplate */}
          <div className="absolute" style={{ left: '32%', top: '42%', transform: 'translate(-50%, -50%)' }}>
            <Button 
              onClick={handleEnter} 
              size="lg" 
              className="bg-transparent hover:bg-transparent text-white font-bold transition-all duration-300 transform hover:scale-105 px-8 py-6 text-xl rounded-full font-mono"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'
              }}
            >
              ENTER
            </Button>
          </div>
          
          {/* Right button over right hotplate */}
          <div className="absolute" style={{ left: '68%', top: '42%', transform: 'translate(-50%, -50%)' }}>
            <Button 
              onClick={handleEnter} 
              size="lg" 
              className="bg-transparent hover:bg-transparent text-white font-bold transition-all duration-300 transform hover:scale-105 px-8 py-6 text-xl rounded-full font-mono"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'
              }}
            >
              EXPERIENCE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandbyLanding;
