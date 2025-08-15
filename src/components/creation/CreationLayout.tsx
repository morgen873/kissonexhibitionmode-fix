
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
    <div className="min-h-screen w-full touch-32-container">
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

      {/* Enhanced Footer with better text visibility and touch optimization */}
      {!hasStartedCreation && (
        <FooterWrapper {...footerProps}>
          <footer className="absolute bottom-0 left-0 right-0 z-10 bg-card/80 backdrop-blur-xl border-t border-border text-foreground w-full text-center py-4 shadow-lg transition-all duration-300">
            <p className="touch-32-display font-semibold">
              A DESIGN PROJECT BY <span className="text-primary font-bold mx-1 drop-shadow-lg hover:opacity-80 transition-opacity duration-300">OREN/LUPE</span>
            </p>
          </footer>
        </FooterWrapper>
      )}
    </div>
  );
};

export default CreationLayout;
