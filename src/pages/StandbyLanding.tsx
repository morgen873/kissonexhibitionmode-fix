import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
const StandbyLanding: React.FC = () => {
  const navigate = useNavigate();
  const handleEnter = () => {
    navigate('/creation');
  };
  return <div className="min-h-screen w-full bg-black flex flex-col items-center justify-between relative overflow-hidden">
      {/* Full screen looping GIF */}
      <div className="absolute inset-0 w-full h-full">
        <img src="https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//stove.gif" alt="Cooking on stovetop" className="w-full h-full object-cover" style={{
        objectFit: 'cover',
        objectPosition: 'center'
      }} />
      </div>

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Title at the top - using flex-1 to push it to top third */}
      <div className="relative z-10 text-center px-4 flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white font-mono drop-shadow-2xl py-0 sm:text-7xl">
          KissOn
        </h1>
      </div>

      {/* Sentence in the middle - using flex-1 to center it */}
      <div className="relative z-10 text-center px-4 flex-1 flex items-center justify-center">
        <p className="text-lg text-white/90 font-mono max-w-md mx-auto leading-relaxed drop-shadow-lg py-[160px] sm:text-2xl">
          Transform your feelings into delicious dumpling recipes
        </p>
      </div>

      {/* Button at the bottom - using flex-1 to push it to bottom third */}
      <div className="relative z-10 text-center px-4 flex-1 flex items-center justify-center">
        <Button onClick={handleEnter} size="lg" className="bg-gradient-to-r from-black via-gray-800 to-black hover:from-gray-800 hover:via-black hover:to-gray-800 text-white font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20 px-10 py-6 text-xl rounded-xl font-mono">
          Enter Experience
        </Button>
      </div>
    </div>;
};
export default StandbyLanding;