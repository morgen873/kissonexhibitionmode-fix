
import React from 'react';
import CreationContainer from '@/components/creation/CreationContainer';
import TransitionAnimation from '@/components/creation/TransitionAnimation';
import VideoSelector from '@/components/creation/VideoSelector';
import { AnimatedContainer } from '@/components/ui/EnhancedAnimations';

interface CreationLayoutProps {
  progress: number;
  theme: any;
  title: string;
  showTitle: boolean;
  hasStartedCreation: boolean;
  isTransitioning: boolean;
  transitionDirection: 'forward' | 'backward';
  transitionVariant?: 'geometric' | 'particle' | 'wave' | 'minimal' | 'loading' | 'video';
  transitionVideoUrl?: string;
  selectedVideoUrl?: string;
  completeTransition: () => void;
  onVideoSelect?: (videoUrl: string) => void;
  children: React.ReactNode;
}

const CreationLayout: React.FC<CreationLayoutProps> = ({
  progress,
  theme,
  title,
  showTitle,
  hasStartedCreation,
  isTransitioning,
  transitionDirection,
  transitionVariant = 'geometric',
  transitionVideoUrl,
  selectedVideoUrl,
  completeTransition,
  onVideoSelect,
  children
}) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <AnimatedContainer variant="fade" duration="normal">
        <CreationContainer
          progress={progress}
          theme={theme}
          title={title}
          showTitle={showTitle}
          hasStartedCreation={hasStartedCreation}
        >
          <AnimatedContainer variant="slide" delay={100}>
            {children}
          </AnimatedContainer>

          {/* Video Selection Interface - Only show when not transitioning */}
          {!isTransitioning && !hasStartedCreation && (
            <div className="mt-8 border-t border-green-400/30 pt-6">
              <div className="max-w-md mx-auto">
                <h3 className="text-green-400 font-mono text-lg mb-4 text-center">
                  Choose Transition Video (Optional)
                </h3>
                <VideoSelector
                  onVideoSelect={onVideoSelect}
                  selectedVideoUrl={selectedVideoUrl}
                />
              </div>
            </div>
          )}
        </CreationContainer>
      </AnimatedContainer>

      {/* Enhanced Transition Animation with Video Support */}
      <TransitionAnimation
        isVisible={isTransitioning}
        direction={transitionDirection}
        onComplete={completeTransition}
        variant={transitionVariant}
        videoUrl={transitionVideoUrl}
      />

      {/* Enhanced Footer with animations */}
      {!hasStartedCreation && (
        <AnimatedContainer variant="slide" delay={200}>
          <footer className="relative z-10 bg-black/90 backdrop-blur-xl border-t border-green-400/30 text-green-100 mt-4 sm:mt-8 w-full text-center py-4 sm:py-6 shadow-xl shadow-green-400/10 hover-glow transition-all duration-300">
            <p className="text-sm sm:text-base font-mono px-4">
              A DESIGN PROJECT BY <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-bold mx-1 animate-shimmer">OREN/LUPE</span>
            </p>
          </footer>
        </AnimatedContainer>
      )}
    </div>
  );
};

export default CreationLayout;
