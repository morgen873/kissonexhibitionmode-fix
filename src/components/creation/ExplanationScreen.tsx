
import React from 'react';

interface ExplanationScreenProps {
  description: string;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({
  description
}) => {
  return (
    <div className="text-center animate-breathe-in">
      <p className="text-lg text-white/80 leading-relaxed max-w-prose whitespace-pre-line font-bold text-center animate-flow-up">
        {description}
      </p>
    </div>
  );
};

export default ExplanationScreen;
