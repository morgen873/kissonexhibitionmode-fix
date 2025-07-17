import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, RefreshCw, Image, AlertCircle } from 'lucide-react';

interface ImageDebugPanelProps {
  recipeResult?: any;
  recipeId?: string | null;
  isVisible?: boolean;
}

export const ImageDebugPanel: React.FC<ImageDebugPanelProps> = ({
  recipeResult,
  recipeId,
  isVisible = false
}) => {
  const [showDebug, setShowDebug] = useState(isVisible);
  const [imageStatus, setImageStatus] = useState<'checking' | 'success' | 'error' | 'placeholder'>('checking');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (recipeResult?.imageUrl) {
      checkImageStatus(recipeResult.imageUrl);
    }
  }, [recipeResult]);

  const checkImageStatus = async (url: string) => {
    setImageStatus('checking');
    setImageUrl(url);
    
    if (url === '/placeholder.svg' || url.includes('placeholder')) {
      setImageStatus('placeholder');
      return;
    }

    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        setImageStatus('success');
      } else {
        setImageStatus('error');
      }
    } catch (error) {
      console.error('Image check failed:', error);
      setImageStatus('error');
    }
  };

  const regenerateImage = async () => {
    if (!recipeId) return;
    
    console.log('🔄 Attempting to regenerate image for recipe:', recipeId);
    // This would trigger a regeneration - for now just log
    alert('Image regeneration would be triggered here');
  };

  const getStatusColor = () => {
    switch (imageStatus) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'placeholder': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (imageStatus) {
      case 'success': return 'Image OK';
      case 'error': return 'Image Failed';
      case 'placeholder': return 'Using Placeholder';
      case 'checking': return 'Checking...';
    }
  };

  if (!showDebug) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 opacity-50 hover:opacity-100"
      >
        <Image className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Image className="h-4 w-4" />
            Image Debug
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDebug(false)}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <Badge variant="outline">{getStatusText()}</Badge>
        </div>
        
        {imageUrl && (
          <div className="text-xs text-muted-foreground break-all">
            <strong>URL:</strong> {imageUrl}
          </div>
        )}
        
        {recipeId && (
          <div className="text-xs text-muted-foreground">
            <strong>Recipe ID:</strong> {recipeId}
          </div>
        )}

        {recipeResult?.imagePrompt && (
          <div className="text-xs text-muted-foreground">
            <strong>Prompt:</strong> {recipeResult.imagePrompt.substring(0, 100)}...
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => imageUrl && checkImageStatus(imageUrl)}
            disabled={imageStatus === 'checking'}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${imageStatus === 'checking' ? 'animate-spin' : ''}`} />
            Check
          </Button>
          
          {imageStatus === 'error' || imageStatus === 'placeholder' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={regenerateImage}
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Retry
            </Button>
          ) : null}
        </div>

        <div className="text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+Shift+I</kbd> to see logs
        </div>
      </CardContent>
    </Card>
  );
};