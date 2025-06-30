import { createClient } from '@supabase/supabase-js'

// 🚨 IMPORTANT: Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://your-project-id.supabase.co'  // ← Replace with your URL
const SUPABASE_ANON_KEY = 'your-anon-key-here'  // ← Replace with your key

if (SUPABASE_URL === 'https://your-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key-here') {
  throw new Error('Missing Supabase variables. Please update with your project credentials.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export default supabase