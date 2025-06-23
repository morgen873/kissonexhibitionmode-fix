
import React from 'react';
import CreationContainer from '@/components/creation/CreationContainer';
import TransitionAnimation from '@/components/creation/TransitionAnimation';

interface CreationLayoutProps {
  progress: number;
  theme: any;
  title: string;
  showTitle: boolean;
  hasStartedCreation: boolean;
  isTransitioning: boolean;
  transitionDirection: 'forward' | 'backward';
  completeTransition: () => void;
  uploadedVideos?: string[];
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
  completeTransition,
  uploadedVideos = [],
  children
}) => {
  return (
    <>
      <CreationContainer
        progress={progress}
        theme={theme}
        title={title}
        showTitle={showTitle}
        hasStartedCreation={hasStartedCreation}
      >
        {children}
      </CreationContainer>

      {/* Transition Animation Overlay */}
      <TransitionAnimation
        isVisible={isTransitioning}
        direction={transitionDirection}
        onComplete={completeTransition}
        customVideos={uploadedVideos}
      />

      {/* Footer for intro flow - made more compact */}
      {!hasStartedCreation && (
        <footer className="relative z-10 bg-black/50 text-white mt-6 w-full text-center border-t-2 border-white/20 py-3">
          <p className="text-sm font-black font-mono">
            A DESIGN PROJECT BY <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mx-1">OREN/LUPE</span>
          </p>
        </footer>
      )}
    </>
  );
};

export default CreationLayout;
