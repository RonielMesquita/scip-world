import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://ibcnhwweueqnvacgtrjh.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY25od3dldWVxbnZhY2d0cmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjM4MTIsImV4cCI6MjA5Mjc5OTgxMn0.-qd2L3orohYMTneDeMp6VclbdSgXFU7D5t2yg9xJmvY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    fetch: fetch.bind(globalThis),
  },
});
