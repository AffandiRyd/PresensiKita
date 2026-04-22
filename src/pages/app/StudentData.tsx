import React, { useState, useEffect } from 'react';
import { Student } from '../../lib/supabase';
import { dataService } from '../../lib/dataService';
import { motion } from 'motion/react';
import { Plus, Search, Edit2, Trash2, X, Save } from 'lucide-react';

export default function StudentDataPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({ nism: '', name: '', class_name: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data } = await dataService.getStudents();
    if (data) setStudents(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingStudent) {
        const { error } = await dataService.updateStudent(editingStudent.id, formData);
        if (error) throw error;
      } else {
        const { error } = await dataService.addStudent(formData);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      setEditingStudent(null);
      setFormData({ nism: '', name: '', class_name: '' });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data siswa.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) return;
    
    const { error } = await dataService.deleteStudent(id);
    if (error) alert('Gagal menghapus data.');
    else fetchStudents();
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nism.includes(searchTerm) ||
    s.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Data Siswa</h1>
          <p className="text-slate-500 font-medium">Kelola daftar siswa yang terdaftar di sistem.</p>
        </div>
        <button
          onClick={() => {
            setEditingStudent(null);
            setFormData({ nism: '', name: '', class_name: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Tambah Siswa
        </button>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari NISM, nama, atau kelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
          />
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">NISM</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-slate-600">{student.nism}</td>
                  <td className="py-4 px-4 text-sm font-bold text-slate-900">{student.name}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {student.class_name}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingStudent(student);
                          setFormData({ nism: student.nism, name: student.name, class_name: student.class_name });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            <div key={student.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{student.nism}</p>
                <p className="text-base font-bold text-slate-900 leading-tight">{student.name}</p>
                <div className="mt-2 text-[10px] font-black text-brand-primary uppercase tracking-widest bg-brand-primary/5 px-2 py-0.5 rounded-md inline-block">
                  {student.class_name}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setEditingStudent(student);
                    setFormData({ nism: student.nism, name: student.name, class_name: student.class_name });
                    setIsModalOpen(true);
                  }}
                  className="p-3 text-brand-primary bg-white border border-slate-100 rounded-xl shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(student.id)}
                  className="p-3 text-rose-600 bg-white border border-slate-100 rounded-xl shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && !loading && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-4">
              <Search className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-500 font-medium">Tidak ada data siswa ditemukan.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NISM</label>
                <input 
                  type="text"
                  required
                  value={formData.nism}
                  onChange={(e) => setFormData({ ...formData, nism: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
                  placeholder="Contoh: 2026001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
                  placeholder="Nama Lengkap Siswa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
                <input 
                  type="text"
                  required
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-light outline-none"
                  placeholder="Contoh: X-MIPA-1"
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-light transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Simpan Data
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
