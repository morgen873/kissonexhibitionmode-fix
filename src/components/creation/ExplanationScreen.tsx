import React from 'react';
interface ExplanationScreenProps {
  description: string;
}
const ExplanationScreen: React.FC<ExplanationScreenProps> = ({
  description
}) => {
  return <div className="flex items-center justify-center h-full opacity-100 transition-opacity duration-300">
      <p className="text-white/80 leading-relaxed max-w-prose whitespace-pre-line text-center font-mono font-normal text-xl">
        {description}
      </p>
    </div>;
};
export default ExplanationScreen;