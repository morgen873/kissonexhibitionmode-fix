
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const StandbyLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/creation');
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      {/* GIF container - takes most of the screen */}
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
        {/* Dark overlay for better contrast with button below */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Button section below the GIF */}
      <div className="bg-black text-center px-4 py-8">
        <Button 
          onClick={handleEnter} 
          size="lg" 
          className="bg-gradient-to-r from-black via-gray-800 to-black hover:from-gray-800 hover:via-black hover:to-gray-800 text-white font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20 px-10 py-6 text-xl rounded-xl font-mono"
        >
          Enter Experience
        </Button>
      </div>
    </div>
  );
};

export default StandbyLanding;
