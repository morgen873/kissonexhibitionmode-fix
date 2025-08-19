import { createClient } from '@supabase/supabase-js';

// Environment variables - in a real app these would be in .env
const supabaseUrl = 'https://ofhteeexidattwcdilpw.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // Global configuration
  global: {
    headers: {
      'x-application': 'kiss-exhibition-mode',
    },
  },
});