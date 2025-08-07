import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aakbcszyodqcywqqztas.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFha2Jjc3p5b2RxY3l3cXF6dGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyOTQzNTYsImV4cCI6MjA2OTg3MDM1Nn0.ingnbvxozbnvDKHL6JO2SKP6-CHUmYj-JAbYuqEcQdg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);