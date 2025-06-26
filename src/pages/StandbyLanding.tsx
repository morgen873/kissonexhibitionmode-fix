
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
        
        {/* Button positioned between the stove surfaces */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform translate-y-8">
            <Button 
              onClick={handleEnter} 
              size="lg" 
              className="bg-transparent hover:bg-white/10 text-white font-bold transition-all duration-300 transform hover:scale-105 border-2 border-white/30 hover:border-white/50 px-10 py-6 text-xl rounded-xl font-mono shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'
              }}
            >
              Enter Experience
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandbyLanding;
