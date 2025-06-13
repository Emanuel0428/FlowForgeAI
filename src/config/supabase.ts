import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. Please check VITE_SUPABASE_URL in your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Test connection on initialization
const testConnection = async () => {
  try {
    const { error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is fine for testing connection
      console.error('Supabase connection test failed:', error);
    }
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    console.error('Please verify:');
    console.error('1. Your Supabase project is active (not paused)');
    console.error('2. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct');
    console.error('3. No network restrictions are blocking the connection');
  }
};

// Run connection test in development
if (import.meta.env.DEV) {
  testConnection();
}

// Helper para verificar si el usuario está autenticado
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

// Helper para obtener la sesión actual
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting current session:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Failed to get current session:', error);
    return null;
  }
};