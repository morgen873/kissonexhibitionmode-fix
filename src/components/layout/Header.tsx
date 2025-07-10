
import { Link } from "react-router-dom";
import { useTheme } from '@/contexts/ThemeContext';

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
        </div>
      </div>
    </header>
  );
};

export default Header;
