
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            KissOn
          </Link>
          <nav>
            <Link 
              to="/creation" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Create Recipe
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
