
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";
import { useTheme } from "@/contexts/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { currentTheme } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <GlobalLayout variant="default">
      <div className="min-h-screen flex items-center justify-center">
        <div className={`text-center ${currentTheme.spacing.container}`}>
          <h1 className={`text-6xl font-bold mb-4 ${currentTheme.colors.primary} ${currentTheme.fonts.primary}`}>404</h1>
          <p className={`text-xl ${currentTheme.colors.textSecondary} ${currentTheme.fonts.secondary} mb-6`}>Oops! Page not found</p>
          <Link 
            to="/creation" 
            className={`${currentTheme.colors.accent} hover:opacity-70 underline text-lg ${currentTheme.fonts.primary} transition-opacity duration-200`}
          >
            Return to Home
          </Link>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default NotFound;
