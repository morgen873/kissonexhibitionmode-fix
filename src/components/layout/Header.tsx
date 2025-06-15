
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/30 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-3xl font-black bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
                    KissOn
                </Link>
                <nav>
                    <Button asChild size="sm" className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white font-bold rounded-full shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm">
                        <Link to="/creation">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Start Creating
                        </Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
