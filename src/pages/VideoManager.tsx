import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Settings } from 'lucide-react';
import VideoManagementInterface from '@/components/creation/VideoManagementInterface';

const VideoManager: React.FC = () => {
  const handleVideoSelect = (videoUrl: string) => {
    console.log('Video selected:', videoUrl);
  };

  const handleTestTransition = (videoUrl: string) => {
    console.log('Testing transition with video:', videoUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-green-400 font-mono mb-4">
              Video Transition Manager
            </h1>
            <p className="text-green-400/70 font-mono">
              Upload, manage, and test MP4 videos for recipe creation transitions
            </p>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-green-400/50 text-green-400 hover:bg-green-400/10">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/creation">
              <Button variant="outline" size="sm" className="border-green-400/50 text-green-400 hover:bg-green-400/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Creation
              </Button>
            </Link>
            <Link to="/video-test">
              <Button variant="outline" size="sm" className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10">
                <Settings className="w-4 h-4 mr-2" />
                Video Test
              </Button>
            </Link>
          </div>
        </div>

        <VideoManagementInterface
          onVideoSelect={handleVideoSelect}
          onTestTransition={handleTestTransition}
        />

        <div className="bg-black/90 border border-green-400/30 rounded-lg p-6">
          <h3 className="text-green-400 font-mono text-lg mb-4">How Video Mapping Works</h3>
          <div className="space-y-3 text-green-400/70 font-mono text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-green-400 font-medium mb-2">Intro Transitions:</h4>
                <ul className="space-y-1">
                  <li>• Quote Step → Creation: <code>3d-kisson.mp4</code></li>
                </ul>
              </div>
              <div>
                <h4 className="text-green-400 font-medium mb-2">Creation Step Transitions:</h4>
                <ul className="space-y-1">
                  <li>• Step 1 (Memory): <code>01step.mp4</code></li>
                  <li>• Step 3 (Emotional): <code>02step.mp4</code></li>
                  <li>• Step 5 (Dedication): <code>03step.mp4</code></li>
                  <li>• Step 6 (Controls): <code>04step.mp4</code></li>
                  <li>• Step 7 (Timeline): <code>05step.mp4</code></li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-400/10 rounded border border-green-400/30">
              <p>
                <strong>Dynamic Loading:</strong> The system automatically finds videos by filename. 
                If a video with the expected name isn't found, it falls back to hardcoded URLs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoManager;