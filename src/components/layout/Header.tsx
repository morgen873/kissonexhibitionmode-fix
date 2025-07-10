
import { Link } from "react-router-dom";
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Video, Settings, Home } from 'lucide-react';

const Header = () => {
  const { currentTheme } = useTheme();
  
  return (
    <header className={`${currentTheme.colors.surface} ${currentTheme.colors.border} border-b ${currentTheme.effects.shadow}`}>
      <div className={`${currentTheme.spacing.container} py-4`}>
        <div className="flex items-center justify-between">
          <Link 
            to="/creation" 
            className={`${currentTheme.colors.primary} ${currentTheme.fonts.primary} font-bold text-xl hover:opacity-80 transition-opacity`}
          >
            Culinary Memory
          </Link>
          
          {/* Navigation Menu */}
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-400/10">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/video-manager">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-400/10">
                <Video className="w-4 h-4 mr-2" />
                Video Manager
              </Button>
            </Link>
            <Link to="/video-test">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-400/10">
                <Settings className="w-4 h-4 mr-2" />
                Video Test
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
