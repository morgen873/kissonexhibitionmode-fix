
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Heart, Sparkles, ArrowRight, Zap, Star } from "lucide-react";

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 relative overflow-hidden text-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-10 w-60 h-60 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-gradient-to-r from-red-400 to-yellow-500 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-16 w-8 h-8 bg-yellow-400 transform rotate-45 animate-spin"></div>
        <div className="absolute top-48 right-32 w-6 h-16 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-12 h-4 bg-cyan-400 animate-pulse"></div>
        <div className="absolute top-2/3 right-16 w-10 h-10 border-4 border-green-400 rounded-full animate-spin"></div>
        <Star className="absolute top-20 left-1/2 w-6 h-6 text-yellow-300 animate-pulse" />
        <Zap className="absolute bottom-32 right-1/3 w-8 h-8 text-purple-300 animate-bounce" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center" style={{minHeight: '80vh', paddingTop: '10vh' }}>
          <div className="text-center max-w-6xl mx-auto">
            {/* Tagline */}
            <div className="relative mb-12">
              <p className="text-5xl md:text-7xl font-black bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                From Feeling To Filling
              </p>
            </div>
            <Button onClick={onStart} size="lg" className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white font-bold rounded-full shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm text-xl px-10 py-6">
              Start The Experience
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
              HOW IT
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
              WORKS
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white font-bold max-w-3xl mx-auto drop-shadow-lg">
            Our AI transforms your feelings into delicious, one-of-a-kind dumpling recipes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Step 1 - Share a feeling */}
          <Card className="bg-transparent border-4 border-pink-400/50 backdrop-blur-md hover:border-pink-300 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 transform hover:-translate-y-4 hover:rotate-1">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-spin">
                <Heart className="h-10 w-10 text-white animate-pulse" />
              </div>
              <h3 className="text-3xl font-black text-white mb-6 drop-shadow-lg">
                SHARE A
                <br />
                <span className="bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
                  FEELING
                </span>
              </h3>
              <p className="text-white font-bold text-lg">
                Share a feeling, a memory, or a dream with our AI.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 - AI Translation */}
          <Card className="bg-transparent border-4 border-purple-400/50 backdrop-blur-md hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-4 hover:-rotate-1">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 via-indigo-500 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Sparkles className="h-10 w-10 text-white animate-spin" />
              </div>
              <h3 className="text-3xl font-black text-white mb-6 drop-shadow-lg">
                AI
                <br />
                <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  TRANSLATION
                </span>
              </h3>
              <p className="text-white font-bold text-lg">
                Our AI translates your input into a unique dumpling recipe.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 - Create & Taste */}
          <Card className="bg-transparent border-4 border-cyan-400/50 backdrop-blur-md hover:border-cyan-300 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-4 hover:rotate-1">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <ChefHat className="h-10 w-10 text-white animate-pulse" />
              </div>
              <h3 className="text-3xl font-black text-white mb-6 drop-shadow-lg">
                CREATE &
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
                  TASTE
                </span>
              </h3>
              <p className="text-white font-bold text-lg">
                Create your KissOn dumpling and taste the feeling.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Psychedelic Quote Section */}
      <div className="relative z-10 bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-pink-900/80 backdrop-blur-md py-20 border-y-4 border-white/20">
        <div className="container mx-auto px-6 text-center">
          <blockquote className="text-4xl md:text-6xl font-black leading-tight max-w-6xl mx-auto mb-8">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
              "EVERY DUMPLING IS A PORTAL,
              <br />
              EVERY BITE A TIME MACHINE"
            </span>
          </blockquote>
          <p className="text-2xl text-white font-black">
            - <span className="text-yellow-300">KissOn</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-black/50 backdrop-blur-md text-white py-12 border-t-4 border-white/20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xl font-black">
            A 
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent mx-2">
              GRAD SCHOOL
            </span>
            PROJECT
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;

