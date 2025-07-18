
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";


const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <GlobalLayout variant="default">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
          <Link 
            to="/creation" 
            className="text-accent hover:opacity-70 underline text-lg transition-opacity duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default NotFound;
