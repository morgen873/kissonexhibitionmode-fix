
import React from 'react';
import { Star, Triangle, Circle } from 'lucide-react';

interface ShapeIconProps {
  shape: string;
  size?: number;
  className?: string;
}

const ShapeIcon: React.FC<ShapeIconProps> = ({ shape, size = 16, className = "" }) => {
  switch (shape.toLowerCase()) {
    case 'star':
      return <Star size={size} className={className} />;
    case 'triangle':
      return <Triangle size={size} className={className} />;
    case 'oval':
    case 'circle':
      return <Circle size={size} className={className} />;
    case 'bundle':
      // Custom SVG for bundle (cluster of circles)
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
          <circle cx="5" cy="5" r="2" fill="currentColor" />
          <circle cx="11" cy="5" r="2" fill="currentColor" />
          <circle cx="8" cy="11" r="2" fill="currentColor" />
        </svg>
      );
    case 'organic':
      // Custom SVG for organic shape
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
          <path 
            d="M8 2C5 2 3 4 3 6.5C3 8 4 9 5 9.5C4 10 3 11 4 13C5 14 7 14 8 13.5C9 14 11 14 12 13C13 11 12 10 11 9.5C12 9 13 8 13 6.5C13 4 11 2 8 2Z" 
            fill="currentColor" 
          />
        </svg>
      );
    default:
      return <Circle size={size} className={className} />;
  }
};

export default ShapeIcon;
