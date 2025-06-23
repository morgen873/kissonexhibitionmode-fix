
import React, { useEffect, useState, useRef } from 'react';

interface TransitionAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  direction?: 'forward' | 'backward';
  customVideos?: string[];
}

const TransitionAnimation: React.FC<TransitionAnimationProps> = ({
  isVisible,
  onComplete,
  direction = 'forward',
  customVideos = []
}) => {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default dumpling images
  const defaultImages = [
    '/lovable-uploads/9e669733-5c8a-4971-926a-51a8a6711aca.png',
    '/lovable-uploads/504c7d32-e678-4269-92bd-2bcbb41ed83d.png',
    '/lovable-uploads/35e09118-6751-4e82-addf-f64a1c994622.png',
    '/lovable-uploads/630333bc-01ff-4495-b5d9-812404b6e842.png'
  ];

  // Use custom videos if available, otherwise fall back to default images
  const mediaItems = customVideos.length > 0 ? customVideos : defaultImages;
  const usingVideos = customVideos.length > 0;

  useEffect(() => {
    if (!isVisible) return;

    console.log('TransitionAnimation: Starting transition with media:', mediaItems);
    console.log('Using videos:', usingVideos);
    
    let timeouts: NodeJS.Timeout[] = [];

    if (usingVideos) {
      // Video-based transition
      setIsVideo(true);
      
      // Play videos sequentially
      mediaItems.forEach((videoUrl, index) => {
        timeouts.push(setTimeout(() => {
          console.log(`TransitionAnimation: Playing video ${index + 1}: ${videoUrl}`);
          setCurrentMedia(index);
          
          // Play the video
          if (videoRef.current) {
            videoRef.current.src = videoUrl;
            videoRef.current.play().catch(e => {
              console.warn('Video autoplay failed:', e);
            });
          }
        }, index * 1000)); // 1 second per video
      });

      // Complete after all videos
      timeouts.push(setTimeout(() => {
        console.log('TransitionAnimation: Video transition complete');
        onComplete();
      }, mediaItems.length * 1000 + 500));
      
    } else {
      // Image-based transition (existing logic)
      setIsVideo(false);
      
      mediaItems.forEach((imagePath, index) => {
        timeouts.push(setTimeout(() => {
          console.log(`TransitionAnimation: Showing image ${index + 1}: ${imagePath}`);
          setCurrentMedia(index);
        }, index * 500)); // 0.5 seconds per image
      });

      timeouts.push(setTimeout(() => {
        console.log('TransitionAnimation: Image transition complete');
        onComplete();
      }, mediaItems.length * 500 + 300));
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isVisible, onComplete, mediaItems, usingVideos]);

  if (!isVisible) return null;

  const currentMediaUrl = mediaItems[currentMedia];
  console.log('TransitionAnimation: Rendering media:', currentMediaUrl, 'isVideo:', isVideo);

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black"
      style={{ zIndex: 9999 }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover transition-opacity duration-150"
          muted
          playsInline
          onLoadedData={() => console.log('TransitionAnimation: Video loaded successfully')}
          onError={(e) => console.error('TransitionAnimation: Video failed to load:', e)}
          onEnded={() => console.log('TransitionAnimation: Video playback ended')}
        />
      ) : (
        <img
          src={currentMediaUrl}
          alt={`Transition ${currentMedia + 1}`}
          className="w-full h-full object-cover transition-opacity duration-150"
          onLoad={() => console.log('TransitionAnimation: Image loaded successfully')}
          onError={(e) => console.error('TransitionAnimation: Image failed to load:', e)}
        />
      )}
    </div>
  );
};

export default TransitionAnimation;
