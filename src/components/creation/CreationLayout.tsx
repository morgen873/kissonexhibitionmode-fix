
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

      {/* Footer for intro flow - elegant Epicure style */}
      {!hasStartedCreation && (
        <footer className="relative z-10 bg-gradient-to-r from-amber-50/90 to-orange-50/90 backdrop-blur-xl text-amber-900 mt-8 w-full text-center border-t border-amber-200/50 py-6 shadow-lg">
          <p className="text-base font-serif">
            A CULINARY MEMORY PROJECT BY <span className="bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent font-bold mx-1">OREN/LUPE</span>
          </p>
        </footer>
      )}
    </>
  );
};

export default CreationLayout;
