import React from 'react';

interface CSS360ImageDisplayProps {
  imageUrl: string;
  recipeTitle: string;
}

const CSS360ImageDisplay: React.FC<CSS360ImageDisplayProps> = ({ imageUrl, recipeTitle }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-lg font-semibold font-mono">360° Interactive View</h3>
      <div className="w-full max-w-[250px] lg:max-w-[300px] relative group">
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <img 
            src={imageUrl}
            alt="360° Rotating Dumpling" 
            className="w-full aspect-square object-cover rotate-360 rotate-360-hover cursor-pointer transition-transform duration-300"
          />
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            360° Live View
          </div>
          <div className="absolute top-2 right-2 bg-purple-600/80 text-white text-xs px-2 py-1 rounded">
            Hover to control
          </div>
        </div>
        <p className="text-center text-sm text-white/70 mt-2">
          Hover over the image to control rotation
        </p>
      </div>
    </div>
  );
};

export default CSS360ImageDisplay;