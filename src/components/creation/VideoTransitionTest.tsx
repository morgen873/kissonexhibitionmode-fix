
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import VideoUploadInterface from './VideoUploadInterface';
import { useEnhancedTransition } from '@/hooks/useEnhancedTransition';
import TransitionAnimation from './TransitionAnimation';

const VideoTransitionTest: React.FC = () => {
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const { isTransitioning, startVideoTransition, completeTransition } = useEnhancedTransition();

  const handleVideoUploaded = (videoUrl: string) => {
    console.log('Video uploaded:', videoUrl);
    setUploadedVideoUrl(videoUrl);
  };

  const handleTestTransition = (videoUrl: string) => {
    console.log('Testing transition with video:', videoUrl);
    startVideoTransition(
      () => {
        console.log('Video transition completed!');
      },
      videoUrl,
      {
        onStart: () => console.log('Video transition started'),
        onComplete: () => console.log('Video transition finished')
      }
    );
  };

  const testOtherTransitions = () => {
    startVideoTransition(
      () => {
        console.log('Geometric transition completed!');
      },
      '', // No video URL triggers fallback
      {
        duration: 2000
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400 font-mono mb-4">
            Video Transition Test Lab
          </h1>
          <p className="text-green-400/70 font-mono">
            Upload a video and test it as a transition animation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Video Upload Interface */}
          <VideoUploadInterface
            onVideoUploaded={handleVideoUploaded}
            onTestTransition={handleTestTransition}
          />

          {/* Test Controls */}
          <div className="space-y-4">
            <div className="bg-black/90 border border-green-400/30 rounded-lg p-6">
              <h3 className="text-green-400 font-mono text-lg mb-4">Test Controls</h3>
              
              <div className="space-y-3">
                {uploadedVideoUrl && (
                  <Button
                    onClick={() => handleTestTransition(uploadedVideoUrl)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-mono"
                    disabled={isTransitioning}
                  >
                    Test Uploaded Video
                  </Button>
                )}

                <Button
                  onClick={testOtherTransitions}
                  variant="outline"
                  className="w-full border-green-400/50 text-green-400 hover:bg-green-400/10 font-mono"
                  disabled={isTransitioning}
                >
                  Test Fallback Animation
                </Button>

                {isTransitioning && (
                  <p className="text-yellow-400 font-mono text-sm text-center">
                    Transition in progress...
                  </p>
                )}
              </div>
            </div>

            {/* Video Info */}
            {uploadedVideoUrl && (
              <div className="bg-black/90 border border-green-400/30 rounded-lg p-4">
                <h4 className="text-green-400 font-mono text-sm mb-2">Video URL:</h4>
                <p className="text-green-400/70 font-mono text-xs break-all">
                  {uploadedVideoUrl}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transition Animation Overlay */}
      <TransitionAnimation
        isVisible={isTransitioning}
        onComplete={completeTransition}
        variant="video"
        videoUrl={uploadedVideoUrl || undefined}
      />
    </div>
  );
};

export default VideoTransitionTest;
