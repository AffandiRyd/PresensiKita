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
  Calendar,
  Zap,
  Info,
  Clock
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
    { label: 'Total Siswa', value: stats.totalStudents, icon: <GraduationCap className="w-6 h-6" />, color: 'from-blue-500 to-blue-600', iconColor: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Total Guru', value: stats.totalTeachers, icon: <Users className="w-6 h-6" />, color: 'from-indigo-500 to-indigo-600', iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { label: 'Hadir Hari Ini', value: stats.todayAttendance, icon: <UserCheck className="w-6 h-6" />, color: 'from-emerald-500 to-emerald-600', iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Tingkat Kehadiran', value: `${stats.attendanceRate}%`, icon: <TrendingUp className="w-6 h-6" />, color: 'from-amber-500 to-amber-600', iconColor: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Selamat datang kembali, <span className="text-brand-primary font-bold">{profile?.full_name}</span>!</p>
        </div>
        <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
          <Clock className="w-5 h-5 text-brand-primary" />
          <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">
            {new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date())}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-premium transition-all relative overflow-hidden"
          >
            <div className={`w-14 h-14 ${card.bgColor} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 mb-6`}>
              <div className={`${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-4xl font-display font-black text-slate-900 tracking-tight">{card.value}</p>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${card.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full`}></div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[80px] rounded-full -z-10"></div>
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <Info className="w-6 h-6 text-brand-primary" />
                Informasi & Pengumuman
              </h2>
              <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            
            <div className="grid gap-5">
              {[
                {
                  title: "Sistem Terintegrasi Penuh",
                  content: "PresensiKita kini mendukung sinkronisasi real-time antar perangkat. Pastikan data absen sudah masuk sebelum pukul 15:00 WIB.",
                  color: "border-brand-primary/20 bg-brand-primary/5"
                },
                {
                  title: "Update Data Siswa",
                  content: "Harap admin segera melakukan verifikasi data siswa baru di menu 'Data Siswa' agar bisa masuk ke daftar presensi guru.",
                  color: "border-brand-accent/20 bg-brand-accent/5"
                }
              ].map((item, i) => (
                <div key={i} className={`p-6 rounded-2xl border ${item.color} transition-transform hover:scale-[1.01]`}>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-brand opacity-[0.02]"></div>
            <h2 className="text-xl font-display font-extrabold text-brand-dark mb-8 uppercase tracking-widest text-left">Profil Saya</h2>
            
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-2 bg-gradient-brand blur-md opacity-20 rounded-full"></div>
              <div className="relative w-28 h-28 bg-gradient-brand rounded-full flex items-center justify-center text-white shadow-xl transform hover:scale-105 transition-transform">
                <Users className="w-12 h-12" />
              </div>
            </div>
            
            <h3 className="text-2xl font-display font-black text-slate-900 leading-tight">{profile?.full_name}</h3>
            <p className="inline-flex px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-black uppercase tracking-widest mt-2">{profile?.role}</p>
            
            <div className="w-full mt-10 pt-8 border-t border-slate-50 space-y-4">
              <div className="flex justify-between items-center py-2 px-4 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                <span className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  Aktif
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID Pegawai</span>
                <span className="text-slate-900 font-mono text-xs font-bold">#{profile?.id.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
