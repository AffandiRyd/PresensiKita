import { supabase, isDemoMode } from './supabase';

// Mock data for Demo Mode
const MOCK_STORAGE_KEY = 'presensikita_mock_data';

const getMockData = () => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!data) {
    const initialData = {
      profiles: [
        { id: 'demo-admin', full_name: 'Admin Demo', role: 'admin', created_at: new Date().toISOString() }
      ],
      students: [
        { id: 's1', nism: '1001', name: 'Budi Santoso', class_name: 'X-A', created_at: new Date().toISOString() },
        { id: 's2', nism: '1002', name: 'Siti Aminah', class_name: 'X-A', created_at: new Date().toISOString() },
        { id: 's3', nism: '1003', name: 'Andi Wijaya', class_name: 'X-B', created_at: new Date().toISOString() }
      ],
      teacher_attendance: [],
      student_attendance: []
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const saveMockData = (data: any) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
};

export const dataService = {
  // Profiles
  async getProfiles() {
    if (isDemoMode) {
      return { data: getMockData().profiles, error: null };
    }
    return await supabase.from('profiles').select('*');
  },

  async getProfile(id: string) {
    if (isDemoMode) {
      const profile = getMockData().profiles.find((p: any) => p.id === id);
      return { data: profile || null, error: null };
    }
    return await supabase.from('profiles').select('*').eq('id', id).single();
  },

  // Students
  async getStudents() {
    if (isDemoMode) {
      return { data: getMockData().students, error: null };
    }
    return await supabase.from('students').select('*').order('name');
  },

  async addStudent(student: any) {
    if (isDemoMode) {
      const data = getMockData();
      const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
      data.students.push(newStudent);
      saveMockData(data);
      return { data: newStudent, error: null };
    }
    return await supabase.from('students').insert(student);
  },

  async updateStudent(id: string, student: any) {
    if (isDemoMode) {
      const data = getMockData();
      const index = data.students.findIndex((s: any) => s.id === id);
      if (index !== -1) {
        data.students[index] = { ...data.students[index], ...student };
        saveMockData(data);
      }
      return { error: null };
    }
    return await supabase.from('students').update(student).eq('id', id);
  },

  async deleteStudent(id: string) {
    if (isDemoMode) {
      const data = getMockData();
      data.students = data.students.filter((s: any) => s.id !== id);
      saveMockData(data);
      return { error: null };
    }
    return await supabase.from('students').delete().eq('id', id);
  },

  // Teacher Attendance
  async getTeacherAttendance(teacherId?: string) {
    if (isDemoMode) {
      let attendance = getMockData().teacher_attendance;
      if (teacherId) {
        attendance = attendance.filter((a: any) => a.teacher_id === teacherId);
      }
      return { data: attendance, error: null };
    }
    let query = supabase.from('teacher_attendance').select('*, profiles(full_name)');
    if (teacherId) query = query.eq('teacher_id', teacherId);
    return await query.order('date', { ascending: false });
  },

  async addTeacherAttendance(attendance: any) {
    if (isDemoMode) {
      const data = getMockData();
      const newAttendance = { ...attendance, id: Math.random().toString(36).substr(2, 9), check_in_time: new Date().toISOString() };
      data.teacher_attendance.push(newAttendance);
      saveMockData(data);
      return { data: newAttendance, error: null };
    }
    return await supabase.from('teacher_attendance').insert(attendance);
  },

  // Student Attendance
  async getStudentAttendance(filters?: any) {
    if (isDemoMode) {
      let attendance = getMockData().student_attendance;
      if (filters?.date) attendance = attendance.filter((a: any) => a.date === filters.date);
      if (filters?.student_id) attendance = attendance.filter((a: any) => a.student_id === filters.student_id);
      return { data: attendance, error: null };
    }
    let query = supabase.from('student_attendance').select('*, students(name, class_name)');
    if (filters?.date) query = query.eq('date', filters.date);
    if (filters?.student_id) query = query.eq('student_id', filters.student_id);
    return await query.order('date', { ascending: false });
  },

  async upsertStudentAttendance(attendance: any[]) {
    if (isDemoMode) {
      const data = getMockData();
      attendance.forEach(item => {
        const index = data.student_attendance.findIndex((a: any) => a.student_id === item.student_id && a.date === item.date);
        if (index !== -1) {
          data.student_attendance[index] = { ...data.student_attendance[index], ...item };
        } else {
          data.student_attendance.push({ ...item, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() });
        }
      });
      saveMockData(data);
      return { error: null };
    }
    return await supabase.from('student_attendance').upsert(attendance);
  },

  // Stats
  async getStats() {
    if (isDemoMode) {
      const data = getMockData();
      return {
        studentCount: data.students.length,
        teacherCount: data.profiles.length,
        attendanceToday: data.student_attendance.filter((a: any) => a.date === new Date().toISOString().split('T')[0]).length
      };
    }
    
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
