import React, { memo } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { QuestionStepProps } from '@/shared/types/creation';
import { cn } from '@/shared/utils/cn';

/**
 * Question step component with single/multi-select options
 * Optimized with React.memo for performance
 */
export const QuestionStep = memo<QuestionStepProps>(({
  step,
  theme,
  selectedAnswers,
  customAnswer,
  onAnswerSelect,
  onCustomAnswerChange,
  onNext,
  onPrevious,
  isNextDisabled,
}) => {
  const hasCustomOption = step.customOption && step.options.some(
    option => option.title === step.customOption?.title
  );

  const customOptionIndex = hasCustomOption 
    ? step.options.findIndex(option => option.title === step.customOption?.title)
    : -1;

  const isCustomSelected = selectedAnswers.includes(customOptionIndex);

  const handleOptionSelect = (index: number) => {
    onAnswerSelect(index);
    
    // Auto-advance for single-select questions (except custom option)
    if (!step.multiSelect && index !== customOptionIndex && !isNextDisabled) {
      setTimeout(onNext, 300); // Small delay for visual feedback
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className={cn(
          'text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent',
          theme.title
        )}>
          {step.question}
        </h2>
      </div>

      <div className="grid gap-4 max-w-2xl mx-auto">
        {step.options.map((option, index) => {
          const isSelected = selectedAnswers.includes(index);
          const isCustomOption = index === customOptionIndex;

          return (
            <div key={index} className="relative">
              <button
                onClick={() => handleOptionSelect(index)}
                className={cn(
                  'w-full p-6 rounded-lg border-2 transition-all duration-300',
                  'text-left hover:scale-[1.02] active:scale-[0.98]',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
                  theme.cardShadow,
                  isSelected
                    ? cn(theme.optionSelectedBorder, theme.optionSelectedShadow, 'shadow-lg')
                    : cn('border-transparent bg-black/20', theme.optionHover)
                )}
              >
                <div className="flex items-start space-x-4">
                  {step.multiSelect && (
                    <div className={cn(
                      'w-5 h-5 rounded border-2 mt-1 flex-shrink-0 transition-colors',
                      isSelected 
                        ? 'bg-white border-white'
                        : 'border-gray-400 bg-transparent'
                    )}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-black m-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">
                      {option.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>

              {/* Custom input for custom option */}
              {isCustomOption && isSelected && (
                <div className="mt-4">
                  <Textarea
                    value={customAnswer}
                    onChange={(e) => onCustomAnswerChange(step.id, e.target.value)}
                    placeholder={step.customOption?.placeholder}
                    className={cn(
                      'w-full bg-black/30 border-gray-600 text-white placeholder-gray-400',
                      'focus:border-white focus:ring-white',
                      theme.textAreaFocus
                    )}
                    rows={3}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4 mt-8">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="lg"
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          disabled={isNextDisabled}
          size="lg"
          className="bg-white text-black hover:bg-gray-100 disabled:opacity-50"
        >
          {step.multiSelect ? 'Continue' : 'Next'}
        </Button>
      </div>

      {/* Progress indicator for multi-select */}
      {step.multiSelect && selectedAnswers.length > 0 && (
        <div className="text-center text-sm text-gray-400">
          {selectedAnswers.length} selected
        </div>
      )}
    </div>
  );
});

QuestionStep.displayName = 'QuestionStep';