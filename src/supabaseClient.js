import { createClient } from '@supabase/supabase-js';

// Get credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the client if credentials exist, otherwise export null
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn("Supabase credentials not found in .env. The app will use local default data. To connect to your Supabase database, create a .env file and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}
