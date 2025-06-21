
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RateLimitResult {
  allowed: boolean;
  remainingRequests?: number;
  resetTime?: Date;
}

export async function checkRateLimit(
  supabaseAdmin: ReturnType<typeof createClient>,
  identifier: string, // IP address or session ID
  maxRequests: number = 5, // Max 5 recipes per hour per IP
  windowMinutes: number = 60
): Promise<RateLimitResult> {
  try {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    
    // Count recent requests from this identifier
    const { data: recentRequests, error } = await supabaseAdmin
      .from('security_audit_log')
      .select('id')
      .eq('resource_type', 'recipe_generation')
      .eq('ip_address', identifier)
      .gte('created_at', windowStart.toISOString());

    if (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request if we can't check
      return { allowed: true };
    }

    const requestCount = recentRequests?.length || 0;
    const remainingRequests = Math.max(0, maxRequests - requestCount);
    const resetTime = new Date(Date.now() + windowMinutes * 60 * 1000);

    if (requestCount >= maxRequests) {
      return {
        allowed: false,
        remainingRequests: 0,
        resetTime
      };
    }

    // Log this request attempt
    await supabaseAdmin
      .from('security_audit_log')
      .insert({
        action: 'recipe_generation_attempt',
        resource_type: 'recipe_generation',
        ip_address: identifier,
        user_agent: 'exhibition_app'
      });

    return {
      allowed: true,
      remainingRequests: remainingRequests - 1,
      resetTime
    };
  } catch (error) {
    console.error('Rate limiter error:', error);
    // Fail open in case of errors
    return { allowed: true };
  }
}
