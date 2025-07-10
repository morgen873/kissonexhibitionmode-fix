
import React from 'react';
import CreationContainer from '@/components/creation/CreationContainer';
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
  completeTransition: () => void;
  children: React.ReactNode;
}

const CreationLayout: React.FC<CreationLayoutProps> = ({
  progress,
  theme,
  title,
  showTitle,
  hasStartedCreation,
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
        </CreationContainer>
      </AnimatedContainer>

      {/* Enhanced Footer with better text visibility */}
      {!hasStartedCreation && (
        <AnimatedContainer variant="slide" delay={200}>
          <footer className="relative z-10 bg-black/95 backdrop-blur-xl border-t border-green-400/30 text-green-100 mt-4 sm:mt-8 w-full text-center sm:py-8 shadow-xl shadow-green-400/10 transition-all duration-300 py-0 my-0">
            <p className="text-base sm:text-lg font-sans px-4 font-semibold">
              A DESIGN PROJECT BY <span className="text-green-400 font-bold mx-1 drop-shadow-lg hover:text-green-300 transition-colors duration-300">OREN/LUPE</span>
            </p>
          </footer>
        </AnimatedContainer>
      )}
    </div>
  );
};

export default CreationLayout;
