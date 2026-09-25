import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://iyfyghzqlcwzyjuqxjlu.supabase.co';

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  'sb_publishable_1JP2P6NgeRAf5ADPjJH78g_KkVa5MzE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
