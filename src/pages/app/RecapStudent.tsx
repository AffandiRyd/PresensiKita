import { useState, useEffect } from 'react';
import { StudentAttendance } from '../../lib/supabase';
import { dataService } from '../../lib/dataService';
import { motion } from 'motion/react';
import { Search, Calendar, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function RecapStudent() {
  const [recap, setRecap] = useState<(StudentAttendance & { students: { name: string, class_name: string } })[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchRecap();
  }, [selectedDate, selectedClass]);

  async function fetchRecap() {
    setLoading(true);
    const { data } = await dataService.getStudentAttendance({ date: selectedDate });
    
    if (data) {
      const formattedData = data as any;
      setRecap(formattedData);
      const uniqueClasses = Array.from(new Set(formattedData.map((r: any) => r.students.class_name))) as string[];
      setClasses(['Semua', ...uniqueClasses]);
    }
    setLoading(false);
  }

  const filteredRecap = recap.filter(r => 
    r.students.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedClass === 'Semua' || r.students.class_name === selectedClass)
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
          <h1 className="text-2xl font-bold text-slate-900">Rekap Absensi Siswa</h1>
          <p className="text-slate-500">Laporan kehadiran siswa harian per kelas.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
          <Download className="w-5 h-5" />
          Ekspor Excel
        </button>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
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
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Waktu Input</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-slate-400">Memuat data...</td></tr>
              ) : filteredRecap.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-bold text-slate-900">{row.students.name}</td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md text-slate-600">
                      {row.students.class_name}
                    </span>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(row.status)}</td>
                  <td className="py-4 px-4 text-sm text-slate-500">
                    {format(new Date(row.created_at), 'HH:mm')}
                  </td>
                </tr>
              ))}
              {!loading && filteredRecap.length === 0 && (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500">Tidak ada data absensi siswa untuk kriteria ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
