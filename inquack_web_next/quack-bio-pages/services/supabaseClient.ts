import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvubsniunymvllpststc.supabase.co';
const supabaseAnonKey = 'sb_publishable_JyrDgNupFkArmHOG-1GZBg_tnlWXwcU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
