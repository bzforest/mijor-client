import { createClient } from '@supabase/supabase-js';

// ดึงค่า URL และ Key มาจากไฟล์ .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '⚠️ Supabase configuration is missing. Please check your .env file.',
      { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey }
    );
  }
}

// ป้องกันโค้ดค้างตอน build โดยการใช้ placeholder ถ้าหาค่าไม่เจอ
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://gqisktdvbtzjwedogtdh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaXNrdGR2YnR6andlZG9ndGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0OTU5NzUsImV4cCI6MjA2MDA3MTk3NX0.61q59_2468012345678901234567890123456789012345678901234567890123456789');
