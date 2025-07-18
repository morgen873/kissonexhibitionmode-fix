
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/creation" 
            className="text-primary font-bold text-xl hover:opacity-80 transition-opacity"
          >
            Culinary Memory
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
