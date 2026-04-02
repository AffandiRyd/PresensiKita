import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Profile } from '../../lib/supabase';
import { dataService } from '../../lib/dataService';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const { profile } = useOutletContext<{ profile: Profile }>();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    todayAttendance: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const { studentCount, teacherCount, attendanceToday } = await dataService.getStats();

      setStats({
        totalStudents: studentCount || 0,
        totalTeachers: teacherCount || 0,
        todayAttendance: attendanceToday || 0,
        attendanceRate: studentCount ? Math.round(((attendanceToday || 0) / studentCount) * 100) : 0
      });
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Siswa', value: stats.totalStudents, icon: <GraduationCap className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Total Guru/Staff', value: stats.totalTeachers, icon: <Users className="w-6 h-6" />, color: 'bg-indigo-500' },
    { label: 'Hadir Hari Ini', value: stats.todayAttendance, icon: <UserCheck className="w-6 h-6" />, color: 'bg-emerald-500' },
    { label: 'Tingkat Kehadiran', value: `${stats.attendanceRate}%`, icon: <TrendingUp className="w-6 h-6" />, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Selamat datang kembali, {profile?.full_name}!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div className={`${card.color} p-3 rounded-xl text-white`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Informasi Sekolah</h2>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="font-bold text-brand-dark mb-1">Pengumuman Digital</h3>
              <p className="text-sm text-slate-600">
                Sistem PresensiKita kini telah terintegrasi penuh. Pastikan semua guru melakukan absensi mandiri sebelum jam 08:00 WIB.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="font-bold text-brand-dark mb-1">Panduan Absensi Siswa</h3>
              <p className="text-sm text-slate-600">
                Guru dapat mengabsen siswa melalui menu "Absensi Siswa" dengan memilih kelas yang sesuai.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Profil Saya</h2>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-brand rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-slate-900">{profile?.full_name}</h3>
            <p className="text-sm text-slate-500 capitalize mb-4">{profile?.role}</p>
            <div className="w-full pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Status</span>
                <span className="text-emerald-600 font-medium">Aktif</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID Pegawai</span>
                <span className="text-slate-900 font-medium">#{profile?.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
