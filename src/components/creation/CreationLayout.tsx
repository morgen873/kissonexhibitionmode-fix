
import React from 'react';
import CreationContainer from '@/components/creation/CreationContainer';
import { AnimatedContainer } from '@/components/ui/EnhancedAnimations';
import FuturisticBackground from '@/components/ui/FuturisticBackground';

interface CreationLayoutProps {
  progress: number;
  theme: any;
  title: string;
  showTitle: boolean;
  hasStartedCreation: boolean;
  isTransitioning: boolean;
  transitionDirection: 'forward' | 'backward';
  transitionVariant?: 'geometric' | 'particle' | 'wave' | 'minimal' | 'loading';
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
  // Conditionally render with or without animations based on creation phase
  const OuterWrapper = hasStartedCreation ? AnimatedContainer : 'div';
  const InnerWrapper = hasStartedCreation ? AnimatedContainer : 'div';
  const FooterWrapper = hasStartedCreation ? AnimatedContainer : 'div';

  const outerProps = hasStartedCreation ? { variant: "fade" as const, duration: "normal" as const } : {};
  const innerProps = hasStartedCreation ? { variant: "slide" as const, delay: 100 } : {};
  const footerProps = hasStartedCreation ? { variant: "slide" as const, delay: 200 } : {};

  return (
    <FuturisticBackground variant="creation" className="overflow-x-hidden">
      <OuterWrapper {...outerProps}>
        <CreationContainer 
          progress={progress} 
          theme={theme} 
          title={title} 
          showTitle={showTitle} 
          hasStartedCreation={hasStartedCreation}
        >
          <InnerWrapper {...innerProps}>
            {children}
          </InnerWrapper>
        </CreationContainer>
      </OuterWrapper>

      {/* Enhanced futuristic footer */}
      {!hasStartedCreation && (
        <FooterWrapper {...footerProps}>
          <footer className="relative z-10 geometric-panel backdrop-blur-xl border-t-2 border-primary/30 text-foreground mt-4 sm:mt-8 w-full text-center sm:py-8 electric-glow transition-all duration-300 py-0 my-0">
            <div className="holographic-surface p-4 rounded-organic mx-4">
              <p className="text-base sm:text-lg font-geometric px-4 font-bold tracking-wider">
                A DESIGN PROJECT BY <span className="text-primary font-bold mx-1 drop-shadow-lg hover:text-accent transition-colors duration-300 animate-holographic-pulse">OREN/LUPE</span>
              </p>
            </div>
          </footer>
        </FooterWrapper>
      )}
    </FuturisticBackground>
  );
};

export default CreationLayout;
