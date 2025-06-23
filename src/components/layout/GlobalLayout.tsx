
import React from 'react';

interface GlobalLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'creation' | 'recipe';
  showHeader?: boolean;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ 
  children, 
  variant = 'default',
  showHeader = true 
}) => {
  const getBackgroundClasses = () => {
    switch (variant) {
      case 'creation':
        return 'bg-gradient-to-br from-black via-gray-900 to-black';
      case 'recipe':
        return 'bg-gradient-to-br from-gray-900 to-slate-800';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'creation':
      case 'recipe':
        return 'text-white';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} ${getTextClasses()} font-mono`}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default GlobalLayout;
