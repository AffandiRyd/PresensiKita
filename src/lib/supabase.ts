import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Smart URL formatting
let supabaseUrl = rawUrl.trim().replace(/\/$/, '');
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  // If user pasted something like "muwygzawxeqvrlgfpppo.supabase.co"
  if (supabaseUrl.includes('.supabase.co')) {
    supabaseUrl = `https://${supabaseUrl}`;
  } else {
    // If user just pasted the project ref (e.g. muwygzawxeqvrlgfpppo)
    supabaseUrl = `https://${supabaseUrl}.supabase.co`;
  }
}

const supabaseAnonKey = rawKey.trim();

const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.includes('.supabase.co') &&
  !supabaseAnonKey.includes('sb_publishable')
);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export { isConfigured };

export type Profile = {
  id: string;
  full_name: string;
  role: 'admin' | 'guru';
  created_at: string;
};

export type Student = {
  id: string;
  nism: string;
  name: string;
  class_name: string;
  created_at: string;
};

export type TeacherAttendance = {
  id: string;
  teacher_id: string;
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
  check_in_time: string;
};

export type StudentAttendance = {
  id: string;
  student_id: string;
  teacher_id: string;
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
  created_at: string;
};
