import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'error' | 'missing_config';
  message: string;
  responseTime?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🔍 Starting API Health Check...');
  const results: HealthCheckResult[] = [];

  // Test Supabase Connection
  try {
    const start = Date.now();
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      results.push({
        service: 'Supabase',
        status: 'missing_config',
        message: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
      });
    } else {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from('recipes').select('id').limit(1);
      
      results.push({
        service: 'Supabase',
        status: error ? 'error' : 'healthy',
        message: error ? error.message : 'Connected successfully',
        responseTime: Date.now() - start
      });
    }
  } catch (error) {
    results.push({
      service: 'Supabase',
      status: 'error',
      message: error.message
    });
  }

  // Test OpenAI API
  try {
    const start = Date.now();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      results.push({
        service: 'OpenAI',
        status: 'missing_config',
        message: 'Missing OPENAI_API_KEY'
      });
    } else {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
      });

      results.push({
        service: 'OpenAI',
        status: response.ok ? 'healthy' : 'error',
        message: response.ok ? 'API accessible' : `HTTP ${response.status}`,
        responseTime: Date.now() - start
      });
    }
  } catch (error) {
    results.push({
      service: 'OpenAI',
      status: 'error',
      message: error.message
    });
  }

  // Test Replicate API
  try {
    const start = Date.now();
    const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
    
    if (!replicateToken) {
      results.push({
        service: 'Replicate',
        status: 'missing_config',
        message: 'Missing REPLICATE_API_TOKEN'
      });
    } else {
      const replicate = new Replicate({ auth: replicateToken });
      await replicate.models.list();
      
      results.push({
        service: 'Replicate',
        status: 'healthy',
        message: 'API accessible',
        responseTime: Date.now() - start
      });
    }
  } catch (error) {
    results.push({
      service: 'Replicate',
      status: 'error',
      message: error.message
    });
  }

  // Test Runware API
  try {
    const start = Date.now();
    const runwareKey = Deno.env.get('RUNWARE_API_KEY');
    
    if (!runwareKey) {
      results.push({
        service: 'Runware',
        status: 'missing_config',
        message: 'Missing RUNWARE_API_KEY'
      });
    } else {
      const response = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          taskType: 'authentication',
          apiKey: runwareKey
        }])
      });

      const data = await response.json();
      const isAuthenticated = data.data?.[0]?.taskType === 'authentication';

      results.push({
        service: 'Runware',
        status: isAuthenticated ? 'healthy' : 'error',
        message: isAuthenticated ? 'Authentication successful' : 'Authentication failed',
        responseTime: Date.now() - start
      });
    }
  } catch (error) {
    results.push({
      service: 'Runware',
      status: 'error',
      message: error.message
    });
  }

  // Test Storage Buckets
  try {
    const start = Date.now();
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.storage.listBuckets();
      
      const buckets = data?.map(bucket => bucket.name) || [];
      const requiredBuckets = ['videos', 'kisson-video', 'recipe_images', 'recipe-images'];
      const missingBuckets = requiredBuckets.filter(bucket => !buckets.includes(bucket));

      results.push({
        service: 'Storage Buckets',
        status: missingBuckets.length === 0 ? 'healthy' : 'error',
        message: missingBuckets.length === 0 
          ? `All buckets available: ${buckets.join(', ')}` 
          : `Missing buckets: ${missingBuckets.join(', ')}`,
        responseTime: Date.now() - start
      });
    }
  } catch (error) {
    results.push({
      service: 'Storage Buckets',
      status: 'error',
      message: error.message
    });
  }

  // Summary
  const healthyCount = results.filter(r => r.status === 'healthy').length;
  const totalCount = results.length;
  const overallStatus = healthyCount === totalCount ? 'healthy' : 'issues_detected';

  console.log('✅ Health check completed');
  
  return new Response(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      overall_status: overallStatus,
      summary: `${healthyCount}/${totalCount} services healthy`,
      results
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    }
  );
});