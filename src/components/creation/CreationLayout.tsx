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
  const outerProps = hasStartedCreation ? {
    variant: "fade" as const,
    duration: "normal" as const
  } : {};
  const innerProps = hasStartedCreation ? {
    variant: "slide" as const,
    delay: 100
  } : {};
  const footerProps = hasStartedCreation ? {
    variant: "slide" as const,
    delay: 200
  } : {};
  return <div className="min-h-screen w-full overflow-x-hidden touch-container-32">
      <OuterWrapper {...outerProps}>
        <CreationContainer progress={progress} theme={theme} title={title} showTitle={showTitle} hasStartedCreation={hasStartedCreation}>
          <InnerWrapper {...innerProps}>
            {children}
          </InnerWrapper>
        </CreationContainer>
      </OuterWrapper>

      {/* Enhanced Footer with better text visibility and touch optimization */}
      {!hasStartedCreation}
    </div>;
};
export default CreationLayout;