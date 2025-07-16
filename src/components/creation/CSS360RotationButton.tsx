import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Loader2 } from 'lucide-react';

interface CSS360RotationButtonProps {
  imageUrl: string;
  recipeName: string;
  onActivate: () => void;
}

const CSS360RotationButton: React.FC<CSS360RotationButtonProps> = ({ 
  imageUrl, 
  recipeName, 
  onActivate 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleActivate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onActivate();
    }, 1000);
  };

  return (
    <Button 
      onClick={handleActivate}
      disabled={isGenerating || imageUrl === '/placeholder.svg'}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Creating 360° View...
        </>
      ) : (
        <>
          <RotateCw className="w-4 h-4" />
          Enable 360° Rotation
        </>
      )}
    </Button>
  );
};

export default CSS360RotationButton;