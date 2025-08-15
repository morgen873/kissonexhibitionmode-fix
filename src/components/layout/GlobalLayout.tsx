
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
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-background text-foreground">
      <div className="w-full h-full touch-32-container touch-32-safe-area bg-black">
        {children}
      </div>
    </div>
  );
};

export default GlobalLayout;
