
import React from 'react';

interface ExplanationScreenProps {
  description: string;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({
  description
}) => {
  return (
    <div className="text-center opacity-100 transition-opacity duration-300">
      <p className="text-lg text-white/80 leading-relaxed max-w-prose whitespace-pre-line font-bold text-center font-mono">
        {description}
      </p>
    </div>
  );
};

export default ExplanationScreen;
