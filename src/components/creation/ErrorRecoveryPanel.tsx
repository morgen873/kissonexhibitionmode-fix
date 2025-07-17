import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Trash2, RotateCcw } from 'lucide-react';

interface ErrorRecoveryPanelProps {
  isVisible: boolean;
  error?: Error | null;
  retryCount: number;
  isRecovering: boolean;
  onRetry: (retryFn: () => Promise<void> | void) => void;
  onClearState: () => void;
  onResetWithRecovery: () => void;
  onForceRefresh: () => void;
  onClose: () => void;
}

export const ErrorRecoveryPanel: React.FC<ErrorRecoveryPanelProps> = ({
  isVisible,
  error,
  retryCount,
  isRecovering,
  onRetry,
  onClearState,
  onResetWithRecovery,
  onForceRefresh,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Recovery Options
          </CardTitle>
          <CardDescription>
            {error ? error.message : 'Something went wrong with the app'}
            {retryCount > 0 && (
              <span className="block mt-1 text-muted-foreground">
                Retry attempts: {retryCount}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onRetry(() => window.location.reload())}
            disabled={isRecovering}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
            {isRecovering ? 'Retrying...' : 'Retry Last Action'}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onResetWithRecovery}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset with Recovery
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClearState}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Browser State
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onForceRefresh}
          >
            Force Full Refresh
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onClose}
          >
            Continue Anyway
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};