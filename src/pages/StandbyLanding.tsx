
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const StandbyLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/creation');
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Full screen looping GIF */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://ncvgpkzguvlypyxhfnuk.supabase.co/storage/v1/object/public/video-bucket/stove-top-cooking.gif"
          alt="Cooking on stovetop"
          className="w-full h-full object-cover"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </div>

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content overlay */}
      <div className="relative z-10 text-center space-y-8 px-4">
        <img 
          src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" 
          alt="KissOn Logo" 
          className="w-32 h-32 sm:w-40 sm:h-40 mx-auto filter grayscale mb-4" 
        />
        
        <h1 className="text-4xl sm:text-6xl font-bold text-white font-mono drop-shadow-2xl">
          KissOn
        </h1>
        
        <p className="text-lg sm:text-xl text-white/90 font-mono max-w-md mx-auto leading-relaxed drop-shadow-lg">
          Transform your feelings into delicious dumpling recipes
        </p>
        
        <Button 
          onClick={handleEnter}
          size="lg" 
          className="bg-gradient-to-r from-black via-gray-800 to-black hover:from-gray-800 hover:via-black hover:to-gray-800 text-white font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20 px-10 py-6 text-xl rounded-xl font-mono mt-8"
        >
          Enter Experience
        </Button>
      </div>
    </div>
  );
};

export default StandbyLanding;
