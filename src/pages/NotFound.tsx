
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
        <div className="text-center responsive-padding">
          <h1 className="responsive-heading-xl mb-4">404</h1>
          <p className="responsive-text text-gray-600 mb-4">Oops! Page not found</p>
          <Link 
            to="/creation" 
            className="text-blue-500 hover:text-blue-700 underline responsive-text transition-colors duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default NotFound;
