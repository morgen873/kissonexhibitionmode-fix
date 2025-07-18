
import React from 'react';
import CreationContainer from '@/components/creation/CreationContainer';
import { AnimatedContainer } from '@/components/ui/EnhancedAnimations';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { currentTheme } = useTheme();
  
  // Conditionally render with or without animations based on creation phase
  const OuterWrapper = hasStartedCreation ? AnimatedContainer : 'div';
  const InnerWrapper = hasStartedCreation ? AnimatedContainer : 'div';
  const FooterWrapper = hasStartedCreation ? AnimatedContainer : 'div';

  const outerProps = hasStartedCreation ? { variant: "fade" as const, duration: "normal" as const } : {};
  const innerProps = hasStartedCreation ? { variant: "slide" as const, delay: 100 } : {};
  const footerProps = hasStartedCreation ? { variant: "slide" as const, delay: 200 } : {};

  return (
    <div className="min-h-screen w-full overflow-x-hidden touch-container-32 force-blackwhite">
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
          <footer className={`relative z-10 ${currentTheme.colors.surface} backdrop-blur-xl border-t ${currentTheme.colors.border} ${currentTheme.colors.text} responsive-margin w-full text-center touch-padding ${currentTheme.effects.shadow} transition-all duration-300`}>
            <p className={`responsive-text ${currentTheme.fonts.primary} touch-container-32 font-semibold touch-32-optimized`}>
              A DESIGN PROJECT BY <span className={`${currentTheme.colors.primary} font-bold mx-1 drop-shadow-lg hover:opacity-80 transition-opacity duration-300`}>OREN/LUPE</span>
            </p>
          </footer>
        </FooterWrapper>
      )}
    </div>
  );
};

export default CreationLayout;
