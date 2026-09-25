import { createClient } from '@supabase/supabase-js';
export const SUPABASE_URL='https://iyfyghzqlcwzyjuqxjlu.supabase.co';
export const SUPABASE_KEY='sb_publishable_1JP2P6NgeRAf5ADPjJH78g_KkVa5MzE';
export const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);