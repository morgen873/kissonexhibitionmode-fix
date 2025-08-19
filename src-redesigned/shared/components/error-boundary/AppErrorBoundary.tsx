import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global error boundary that catches and handles React errors
 * Provides user-friendly error UI and recovery options
 */
export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    this.logError(error, errorInfo);
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, send to error monitoring service
    console.error('Application Error:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-black/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-500/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h1>
              
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>

            {isDevelopment && this.state.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded text-left">
                <p className="text-red-300 text-sm font-mono mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.error.stack && (
                  <details className="text-xs text-red-400">
                    <summary className="cursor-pointer mb-2">Stack Trace</summary>
                    <pre className="whitespace-pre-wrap break-words">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}