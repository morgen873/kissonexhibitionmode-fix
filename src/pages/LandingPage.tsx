
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleEnterApp = () => {
    navigate('/creation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 overflow-hidden relative">
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" 
              alt="KissOn Logo" 
              className="mx-auto w-48 md:w-64 lg:w-80 filter drop-shadow-2xl" 
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              TASTE YOUR
            </span>
            <br />
            <span className="text-white">
              FEELINGS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white font-bold mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Transform emotions into delicious, AI-crafted dumpling recipes. 
            Every feeling becomes flavor, every memory becomes a meal.
          </p>

          {/* Call to Action */}
          <Button 
            onClick={handleEnterApp}
            size="lg" 
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white font-black text-xl md:text-2xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm"
          >
            Start Creating
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-lg text-white/80 font-mono drop-shadow-lg">
              Where culinary art meets artificial intelligence
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-white/60 font-mono">
            A DESIGN PROJECT BY{' '}
            <span className="text-yellow-300 font-bold text-shadow-lg">
              OREN/LUPE
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
