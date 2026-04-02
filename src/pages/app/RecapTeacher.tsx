import { useState, useEffect } from 'react';
import { supabase, TeacherAttendance } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Search, Calendar, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function RecapTeacher() {
  const [recap, setRecap] = useState<(TeacherAttendance & { profiles: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchRecap();
  }, [selectedDate]);

  async function fetchRecap() {
    setLoading(true);
    const { data } = await supabase
      .from('teacher_attendance')
      .select('*, profiles(full_name)')
      .eq('date', selectedDate)
      .order('check_in_time', { ascending: false });
    
    if (data) setRecap(data as any);
    setLoading(false);
  }

  const filteredRecap = recap.filter(r => 
    r.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      hadir: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      izin: 'bg-amber-50 text-amber-700 border-amber-100',
      sakit: 'bg-blue-50 text-blue-700 border-blue-100',
      alfa: 'bg-red-50 text-red-700 border-red-100',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.alfa}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rekap Absensi Guru</h1>
          <p className="text-slate-500">Laporan kehadiran guru dan staff harian.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
          <Download className="w-5 h-5" />
          Ekspor PDF
        </button>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari nama guru..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Nama Guru</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Waktu Absen</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-slate-400">Memuat data...</td></tr>
              ) : filteredRecap.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-bold text-slate-900">{row.profiles.full_name}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {format(new Date(row.check_in_time), 'HH:mm:ss')} WIB
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(row.status)}</td>
                  <td className="py-4 px-4 text-sm text-slate-500">-</td>
                </tr>
              ))}
              {!loading && filteredRecap.length === 0 && (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500">Tidak ada data absensi untuk tanggal ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
