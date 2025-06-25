
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VideoRetriever } from '@/utils/videoRetriever';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoveVideo = async () => {
      try {
        const videos = await VideoRetriever.getAvailableVideos();
        const stoveVideo = videos.find(video => video.name.toLowerCase().includes('stove'));
        
        if (stoveVideo) {
          setVideoUrl(stoveVideo.url);
        } else {
          console.log('Stove video not found, available videos:', videos.map(v => v.name));
        }
      } catch (error) {
        console.error('Failed to load stove video:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoveVideo();
  }, []);

  const handleEnterApp = () => {
    navigate('/creation');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-mono animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Video Background */}
      {videoUrl && (
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Video error:', e);
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="image/gif" />
          </video>
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Fallback background if video doesn't load */}
      {!videoUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900" />
      )}

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
            A DESIGN PROJECT BY <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent font-bold">OREN/LUPE</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
