import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorRecoveryState {
  error: Error | null;
  isRecovering: boolean;
  retryCount: number;
}

export const useErrorRecovery = () => {
  const [state, setState] = useState<ErrorRecoveryState>({
    error: null,
    isRecovering: false,
    retryCount: 0
  });

  const handleError = useCallback((error: Error, context?: string) => {
    console.error(`❌ Error in ${context || 'unknown context'}:`, error);
    
    setState(prev => ({
      ...prev,
      error,
      retryCount: prev.retryCount + 1
    }));

    // Show user-friendly error toast
    toast({
      title: "Something went wrong",
      description: `${context ? `${context}: ` : ''}${error.message}`,
      variant: "destructive"
    });
  }, []);

  const retry = useCallback(async (retryFunction: () => Promise<void> | void) => {
    setState(prev => ({ ...prev, isRecovering: true }));
    
    try {
      await retryFunction();
      
      // Clear error on successful retry
      setState(prev => ({
        ...prev,
        error: null,
        isRecovering: false
      }));
      
      toast({
        title: "Recovered successfully",
        description: "The operation completed successfully after retry."
      });
    } catch (retryError) {
      console.error('❌ Retry failed:', retryError);
      setState(prev => ({
        ...prev,
        isRecovering: false,
        retryCount: prev.retryCount + 1
      }));
      
      toast({
        title: "Retry failed",
        description: "Please try again or refresh the page.",
        variant: "destructive"
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState({
      error: null,
      isRecovering: false,
      retryCount: 0
    });
  }, []);

  const forceRefresh = useCallback(() => {
    toast({
      title: "Refreshing application",
      description: "Clearing cache and restarting..."
    });
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cache if available
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Reload page
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

  return {
    error: state.error,
    isRecovering: state.isRecovering,
    retryCount: state.retryCount,
    handleError,
    retry,
    clearError,
    forceRefresh
  };
};