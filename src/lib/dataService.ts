import { supabase } from './supabase';

export const dataService = {
  // Profiles
  async getProfiles() {
    return await supabase.from('profiles').select('*');
  },

  async getProfile(id: string) {
    return await supabase.from('profiles').select('*').eq('id', id).single();
  },

  // Students
  async getStudents() {
    return await supabase.from('students').select('*').order('name');
  },

  async addStudent(student: any) {
    return await supabase.from('students').insert(student);
  },

  async updateStudent(id: string, student: any) {
    return await supabase.from('students').update(student).eq('id', id);
  },

  async deleteStudent(id: string) {
    return await supabase.from('students').delete().eq('id', id);
  },

  // Teacher Attendance
  async getTeacherAttendance(teacherId?: string) {
    let query = supabase.from('teacher_attendance').select('*, profiles(full_name)');
    if (teacherId) query = query.eq('teacher_id', teacherId);
    return await query.order('date', { ascending: false });
  },

  async addTeacherAttendance(attendance: any) {
    return await supabase.from('teacher_attendance').insert(attendance);
  },

  // Student Attendance
  async getStudentAttendance(filters?: any) {
    let query = supabase.from('student_attendance').select('*, students(name, class_name)');
    if (filters?.date) query = query.eq('date', filters.date);
    if (filters?.student_id) query = query.eq('student_id', filters.student_id);
    return await query.order('date', { ascending: false });
  },

  async upsertStudentAttendance(attendance: any[]) {
    return await supabase.from('student_attendance').upsert(attendance);
  },

  // Stats
  async getStats() {
    const today = new Date().toISOString().split('T')[0];
    const [
      { count: studentCount },
      { count: teacherCount },
      { count: attendanceCount }
    ] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('student_attendance').select('*', { count: 'exact', head: true }).eq('date', today)
    ]);

    return {
      studentCount: studentCount || 0,
      teacherCount: teacherCount || 0,
      attendanceToday: attendanceCount || 0
    };
  }
};
