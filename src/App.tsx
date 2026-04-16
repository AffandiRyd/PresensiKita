import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { Settings, AlertCircle, Database } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/app/Dashboard';
import TeacherAttendance from './pages/app/TeacherAttendance';
import StudentAttendance from './pages/app/StudentAttendance';
import RecapTeacher from './pages/app/RecapTeacher';
import RecapStudent from './pages/app/RecapStudent';
import StudentData from './pages/app/StudentData';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setConnectionError(err.message || 'Gagal terhubung ke Supabase');
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isConfigured || connectionError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {connectionError ? 'Koneksi Gagal' : 'Database Belum Terhubung'}
          </h1>
          <p className="text-slate-600 mb-6">
            {connectionError 
              ? `Terjadi kesalahan saat menghubungi Supabase: "${connectionError}". Periksa kembali kredensial Anda.`
              : 'Error "Failed to fetch" terjadi karena aplikasi tidak dapat menghubungi server Supabase. Anda perlu mengatur kredensial yang benar di panel Secrets AI Studio.'}
          </p>
          
          <div className="space-y-4 text-left">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-bold mb-1">Tips Perbaikan:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Pastikan <strong>VITE_SUPABASE_URL</strong> berformat <code>https://xyz.supabase.co</code></li>
                  <li>Pastikan <strong>VITE_SUPABASE_ANON_KEY</strong> adalah kunci "anon public", bukan "service role"</li>
                  <li>Pastikan proyek Supabase Anda tidak sedang dalam status "Paused"</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-mono">
              <p className="text-slate-500"># Cek di Secrets:</p>
              <p className="text-brand-dark">VITE_SUPABASE_URL=...</p>
              <p className="text-brand-dark">VITE_SUPABASE_ANON_KEY=...</p>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-light transition-all shadow-md"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/app" />} />
        
        <Route path="/app" element={session ? <AppLayout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="teacher-attendance" element={<TeacherAttendance />} />
          <Route path="student-attendance" element={<StudentAttendance />} />
          <Route path="recap-teacher" element={<RecapTeacher />} />
          <Route path="recap-student" element={<RecapStudent />} />
          <Route path="students" element={<StudentData />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

