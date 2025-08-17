import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'error' | 'missing_config';
  message: string;
  responseTime?: number;
}

interface HealthCheckResponse {
  timestamp: string;
  overall_status: string;
  summary: string;
  results: HealthCheckResult[];
}

export function HealthChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<HealthCheckResponse | null>(null);

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('api-health-check');
      
      if (error) {
        throw error;
      }

      setResults(data);
      
      if (data.overall_status === 'healthy') {
        toast.success('All API integrations are healthy!');
      } else {
        toast.warning('Some API integrations have issues. Check the details below.');
      }
    } catch (error) {
      console.error('Health check failed:', error);
      toast.error('Failed to run health check');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'missing_config':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'missing_config':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          API Health Checker
          {results && (
            <Badge variant={results.overall_status === 'healthy' ? 'default' : 'destructive'}>
              {results.summary}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runHealthCheck} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking APIs...
            </>
          ) : (
            'Run Health Check'
          )}
        </Button>

        {results && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Last checked: {new Date(results.timestamp).toLocaleString()}
            </div>
            
            {results.results.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.service}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.message}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result.responseTime && (
                    <span className="text-xs text-muted-foreground">
                      {result.responseTime}ms
                    </span>
                  )}
                  <Badge className={getStatusColor(result.status)}>
                    {result.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}