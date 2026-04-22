import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Profile, TeacherAttendance } from '../../lib/supabase';
import { dataService } from '../../lib/dataService';
import { motion } from 'motion/react';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TeacherAttendancePage() {
  const { profile } = useOutletContext<{ profile: Profile }>();
  const [attendance, setAttendance] = useState<TeacherAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    async function fetchTodayAttendance() {
      if (!profile) return;
      const { data } = await dataService.getTeacherAttendance(profile.id);
      
      const todayRecord = data?.find((a: any) => a.date === today);
      setAttendance(todayRecord || null);
      setLoading(false);
    }
    fetchTodayAttendance();
  }, [profile, today]);

  const handleAttendance = async (status: 'hadir' | 'izin' | 'sakit') => {
    if (!profile) return;
    setSubmitting(true);
    
    try {
      const { data, error } = await dataService.addTeacherAttendance({
        teacher_id: profile.id,
        date: today,
        status,
        check_in_time: new Date().toISOString()
      });

      if (error) throw error;
      setAttendance(data);
    } catch (err) {
      console.error(err);
      alert('Gagal melakukan absensi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-12 bg-slate-200 rounded-xl w-1/4"></div><div className="h-64 bg-slate-200 rounded-2xl"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="mb-10 lg:text-center">
        <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Absensi Guru & Staff</h1>
        <p className="text-slate-500 font-medium mt-1">Lakukan absensi mandiri harian Anda di sini.</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-brand-dark rounded-2xl mb-6">
          <Calendar className="w-8 h-8" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
        </h2>
        <p className="text-slate-500 mb-8">Waktu Server: {format(new Date(), 'HH:mm')} WIB</p>

        {attendance ? (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <div className="flex items-center justify-center gap-3 text-emerald-700 font-bold mb-2">
              <CheckCircle className="w-6 h-6" />
              Absensi Berhasil
            </div>
            <p className="text-emerald-600 text-sm">
              Anda telah melakukan absensi pada pukul {format(new Date(attendance.check_in_time), 'HH:mm')} WIB dengan status <span className="capitalize font-bold">{attendance.status}</span>.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-6">Pilih status kehadiran Anda hari ini:</p>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleAttendance('hadir')}
                disabled={submitting}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all font-bold disabled:opacity-50"
              >
                <CheckCircle className="w-6 h-6" />
                Hadir
              </button>
              <button
                onClick={() => handleAttendance('izin')}
                disabled={submitting}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all font-bold disabled:opacity-50"
              >
                <Clock className="w-6 h-6" />
                Izin
              </button>
              <button
                onClick={() => handleAttendance('sakit')}
                disabled={submitting}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-red-100 bg-red-50 text-red-700 hover:bg-red-100 transition-all font-bold disabled:opacity-50"
              >
                <AlertCircle className="w-6 h-6" />
                Sakit
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h3 className="font-bold text-brand-dark mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Informasi Penting
        </h3>
        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
          <li>Batas waktu absensi hadir adalah pukul 08:00 WIB.</li>
          <li>Jika Anda izin atau sakit, harap lampirkan keterangan ke bagian administrasi.</li>
          <li>Absensi hanya dapat dilakukan satu kali dalam sehari.</li>
        </ul>
      </div>
    </div>
  );
}
