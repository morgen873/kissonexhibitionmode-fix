
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Heart, Sparkles, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-300 rounded-full opacity-70"></div>
        
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Flavor
              </span>
              <br />
              <span className="text-gray-800">Memory</span>
              <br />
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Forge
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
              Transform your memories and emotions into 
              <span className="text-orange-500 font-bold"> delicious dumpling recipes</span>
            </p>
            
            {/* CTA Button */}
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Creating Magic
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            How It <span className="text-pink-500">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI transforms your personal stories into unique dumpling recipes that capture the essence of your memories
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <Card className="bg-white/70 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Your Story</h3>
              <p className="text-gray-600">
                Tell us about a memory, emotion, or experience that's meaningful to you
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="bg-white/70 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Magic</h3>
              <p className="text-gray-600">
                Our AI analyzes your story and creates a unique dumpling recipe inspired by your emotions
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="bg-white/70 backdrop-blur-sm border-2 border-yellow-200 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Cook & Remember</h3>
              <p className="text-gray-600">
                Follow your personalized recipe and create dumplings that taste like your memories
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quote Section */}
      <div className="bg-gradient-to-r from-pink-100 to-orange-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <blockquote className="text-3xl md:text-4xl font-bold text-gray-800 max-w-4xl mx-auto leading-relaxed">
            "Every dumpling tells a story, every bite holds a memory"
          </blockquote>
          <p className="text-lg text-gray-600 mt-4 font-medium">
            - A Graduate Exhibition Experience
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">
            Created with ❤️ for the Graduate School Exhibition
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
