import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rddwlymeypyocabotkls.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZHdseW1leXB5b2NhYm90a2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTM0NzAsImV4cCI6MjA3NzE2OTQ3MH0.FBrov6MTANMiFqoFf1711dfVvJpB5jYmGWZrNVQLW7I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);