
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
      />

      {/* Footer for intro flow - Epicure style with black and green theme */}
      {!hasStartedCreation && (
        <footer className="relative z-10 bg-black/90 backdrop-blur-xl border-t border-green-400/30 text-green-100 mt-8 w-full text-center py-6 shadow-xl shadow-green-400/10">
          <p className="text-base font-mono">
            A DESIGN PROJECT BY <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-bold mx-1">OREN/LUPE</span>
          </p>
        </footer>
      )}
    </>
  );
};

export default CreationLayout;
