
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/30 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/creation" className="text-3xl font-black bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
                    KissOn
                </Link>
                <nav>
                    {/* "Start Creating" button removed for a cleaner look */}
                </nav>
            </div>
        </header>
    );
};

export default Header;
