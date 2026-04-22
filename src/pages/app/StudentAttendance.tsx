import { useState, useEffect } from 'react';
import { Student } from '../../lib/supabase';
import { dataService } from '../../lib/dataService';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Search, Filter, AlertCircle, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

export default function StudentAttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, 'hadir' | 'izin' | 'sakit' | 'alfa'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    async function fetchData() {
      const { data: studentData } = await dataService.getStudents();
      if (studentData) {
        setStudents(studentData);
        const uniqueClasses = Array.from(new Set(studentData.map(s => s.class_name)));
        setClasses(uniqueClasses);
        if (uniqueClasses.length > 0) setSelectedClass(uniqueClasses[0]);
      }

      // Fetch existing attendance for today
      const { data: existingAttendance } = await dataService.getStudentAttendance({ date: today });
      
      if (existingAttendance) {
        const initialData: Record<string, any> = {};
        existingAttendance.forEach(a => {
          initialData[a.student_id] = a.status;
        });
        setAttendanceData(initialData);
      }
      
      setLoading(false);
    }
    fetchData();
  }, [today]);

  const handleStatusChange = (studentId: string, status: 'hadir' | 'izin' | 'sakit' | 'alfa') => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filteredStudents = students.filter(s => s.class_name === selectedClass);
    const records = filteredStudents.map(s => ({
      student_id: s.id,
      teacher_id: user.id,
      date: today,
      status: attendanceData[s.id] || 'alfa'
    }));

    try {
      const { error } = await dataService.upsertStudentAttendance(records);
      if (error) throw error;
      alert('Absensi berhasil disimpan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan absensi.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.class_name === selectedClass && 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-12 bg-slate-200 rounded-xl w-1/4"></div><div className="h-96 bg-slate-200 rounded-2xl"></div></div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Absensi Siswa</h1>
          <p className="text-slate-500 font-medium">Kelola kehadiran siswa kelas <span className="text-brand-primary font-bold">{selectedClass}</span> hari ini.</p>
        </div>
        <button
          onClick={saveAttendance}
          disabled={saving || filteredStudents.length === 0}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/20 disabled:opacity-50 active:scale-95 group"
        >
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {saving ? 'Menyimpan...' : 'Simpan Absensi'}
        </button>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari nama siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">NISM</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-slate-600">{student.nism}</td>
                  <td className="py-4 px-4 text-sm font-bold text-slate-900">{student.name}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {[
                        { id: 'hadir', label: 'H', color: 'emerald' },
                        { id: 'izin', label: 'I', color: 'amber' },
                        { id: 'sakit', label: 'S', color: 'blue' },
                        { id: 'alfa', label: 'A', color: 'red' },
                      ].map((status) => {
                        const isSelected = attendanceData[student.id] === status.id;
                        return (
                          <button
                            key={status.id}
                            onClick={() => handleStatusChange(student.id, status.id as any)}
                            title={status.id.toUpperCase()}
                            className={cn(
                              "w-10 h-10 rounded-lg font-bold transition-all border-2",
                              isSelected
                                ? `bg-${status.color}-500 border-${status.color}-600 text-white shadow-md scale-110`
                                : `bg-white border-slate-100 text-slate-400 hover:border-${status.color}-300 hover:text-${status.color}-500`
                            )}
                          >
                            {status.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{student.nism}</p>
                  <p className="text-lg font-bold text-slate-900">{student.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { id: 'hadir', label: 'Hadir', color: 'emerald' },
                  { id: 'izin', label: 'Izin', color: 'amber' },
                  { id: 'sakit', label: 'Sakit', color: 'blue' },
                  { id: 'alfa', label: 'Alfa', color: 'red' },
                ].map((status) => {
                  const isSelected = attendanceData[student.id] === status.id;
                  return (
                    <button
                      key={status.id}
                      onClick={() => handleStatusChange(student.id, status.id as any)}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold text-xs transition-all border-2",
                        isSelected
                          ? `bg-${status.color}-500 border-${status.color}-600 text-white shadow-md`
                          : `bg-white border-slate-100 text-slate-400`
                      )}
                    >
                      {status.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            <div className="flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <p className="font-medium">Tidak ada data siswa ditemukan.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
