import { useState, useEffect } from 'react';
import { TeacherAttendance } from '../../lib/supabase';
import { dataService } from '../../lib/dataService';
import { motion } from 'motion/react';
import { Search, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';

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
    const { data } = await dataService.getTeacherAttendance();
    
    if (data) {
      const filtered = data.filter((r: any) => r.date === selectedDate);
      setRecap(filtered as any);
    }
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Rekap Absensi Guru</h1>
          <p className="text-slate-500 font-medium">Laporan kehadiran guru dan staff harian.</p>
        </div>
        <button className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-brand-primary hover:text-white transition-all shadow-sm hover:shadow-premium group">
          <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Ekspor Excel
        </button>
      </header>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text"
              placeholder="Cari nama guru..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider font-display">Nama Guru</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider font-display">Waktu Absen</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider font-display">Status</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider font-display">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-slate-400 italic">Memuat data...</td></tr>
              ) : filteredRecap.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-bold text-slate-900">{row.profiles.full_name}</td>
                  <td className="py-4 px-4 text-sm text-slate-500 font-mono">
                    {format(new Date(row.check_in_time), 'HH:mm:ss')} WIB
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(row.status)}</td>
                  <td className="py-4 px-4 text-sm text-slate-500">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="py-8 text-center text-slate-400 italic">Memuat data...</div>
          ) : filteredRecap.map((row) => (
            <div key={row.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-slate-900 leading-tight mb-1">{row.profiles.full_name}</p>
                <p className="text-[10px] font-bold text-slate-400 font-mono">
                  {format(new Date(row.check_in_time), 'HH:mm:ss')} WIB
                </p>
              </div>
              <div>{getStatusBadge(row.status)}</div>
            </div>
          ))}
        </div>

        {!loading && filteredRecap.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-4">
              <Calendar className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-500 font-medium">Tidak ada data absensi ditemukan untuk tanggal ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
