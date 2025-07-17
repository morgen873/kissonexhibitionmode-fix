
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GifTransition from './GifTransition';

const GifTransitionTester: React.FC = () => {
  const [gifUrl, setGifUrl] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testTransition = () => {
    if (!gifUrl.trim()) {
      alert('Please enter a GIF URL');
      return;
    }
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    console.log('GIF transition completed');
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/90 border-green-400/30">
      <CardHeader>
        <CardTitle className="text-center text-green-400 font-mono">
          GIF Transition Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-green-400 font-mono text-sm">
            GIF URL (from Supabase or external):
          </label>
          <Input
            type="url"
            value={gifUrl}
            onChange={(e) => setGifUrl(e.target.value)}
            placeholder="https://your-supabase-url.com/storage/v1/object/public/your-gif.gif"
            className="bg-black/50 border-green-400/50 text-green-400 placeholder-green-400/50"
          />
        </div>
        
        <Button
          onClick={testTransition}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-mono"
          disabled={isTransitioning}
        >
          {isTransitioning ? 'Playing Transition...' : 'Test GIF Transition'}
        </Button>

        <div className="text-center">
          <p className="text-green-400/70 font-mono text-xs">
            The GIF will play for 3 seconds by default
          </p>
        </div>
      </CardContent>

      {/* GIF Transition */}
      <GifTransition
        gifUrl={gifUrl}
        isVisible={isTransitioning}
        onComplete={handleTransitionComplete}
        duration={3000}
      />
    </Card>
  );
};

export default GifTransitionTester;
