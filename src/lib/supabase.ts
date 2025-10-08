import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your environment settings.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('bookings').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return { success: true, message: 'Connected to Supabase' };
  } catch (error: any) {
    console.error('Supabase connection error:', error);
    return { success: false, message: error.message };
  }
};
