import React from 'react';
interface ExplanationScreenProps {
  description: string;
}
const ExplanationScreen: React.FC<ExplanationScreenProps> = ({
  description
}) => {
  return <div className="text-center my-8">
            <p className="text-lg text-white/80 leading-relaxed max-w-prose whitespace-pre-line py-0 px-0 mx-[10px] my-0 font-bold text-center">
                {description}
            </p>
        </div>;
};
export default ExplanationScreen;