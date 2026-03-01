
import { createClient } from '@supabase/supabase-js';

// Project credentials as provided
const supabaseUrl = 'https://okbridtkatzqrrzerrrc.supabase.co';
const supabaseKey = 'sb_publishable_F0lzffs_s8Ra-ANfGm6RFQ_KifG18sI';

export const supabase = createClient(supabaseUrl, supabaseKey);
