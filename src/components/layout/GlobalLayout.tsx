
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full responsive-container touch-container bg-black">
        {children}
      </div>
    </div>
  );
};

export default GlobalLayout;
