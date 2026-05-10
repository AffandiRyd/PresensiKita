import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { Settings, AlertCircle, Database } from 'lucide-react';
import { motion } from 'motion/react';
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
        // Check for URL mismatch if it's a Supabase JWT
        try {
          const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
          if (key && key.includes('.')) {
            const payload = JSON.parse(atob(key.split('.')[1]));
            const url = import.meta.env.VITE_SUPABASE_URL || '';
            if (payload.ref && !url.includes(payload.ref)) {
              setConnectionError(`URL Mismatch: Kunci Anda untuk proyek "${payload.ref}", tapi URL Anda adalah "${url}".`);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('JWT check failed', e);
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          // If the error is about an invalid refresh token, just sign out to clear it
          if (error.message.includes('Refresh Token Not Found') || error.message.includes('refresh_token_not_found')) {
            await supabase.auth.signOut();
            setSession(null);
          } else {
            throw error;
          }
        } else {
          setSession(session);
        }
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        // Only set connection error if it's not a session-related error
        if (!err.message?.includes('Refresh Token')) {
          setConnectionError(err.message || 'Gagal terhubung ke Supabase');
        }
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
      <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent/5 blur-[100px] rounded-full -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-white p-10 md:p-12 rounded-[2.5rem] shadow-premium border border-slate-100 relative"
        >
          <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner-border">
            <Database className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-4 tracking-tight text-center">
            {connectionError ? 'Koneksi Terputus' : 'Konfigurasi Diperlukan'}
          </h1>
          <p className="text-slate-500 font-medium mb-10 text-center leading-relaxed">
            {connectionError 
              ? `Kami mendeteksi masalah pada koneksi Supabase Anda: "${connectionError}". Silakan periksa kredensial di panel Secrets.`
              : 'Sistem membutuhkan koneksi database Supabase yang valid untuk berfungsi. Harap atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.'}
          </p>
          
          <div className="space-y-6">
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">
                <p className="font-extrabold text-amber-900 mb-2 uppercase tracking-widest text-[10px]">Langkah Perbaikan:</p>
                <ul className="text-amber-800/80 space-y-2 list-disc pl-4 leading-relaxed">
                  <li>Gunakan URL berformat <code className="bg-white/50 px-1 rounded">https://[ID].supabase.co</code></li>
                  <li>Pastikan Anda menyalin "anon public key" dengan benar</li>
                  <li>Pastikan status proyek Anda "Active" di dashboard Supabase</li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Required Secrets:</p>
               <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-400">URL</span>
                    <span className="text-brand-primary font-bold">VITE_SUPABASE_URL</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-400">KEY</span>
                    <span className="text-brand-primary font-bold">VITE_SUPABASE_ANON_KEY</span>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-5 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/20 active:scale-95"
            >
              Segarkan Halaman
            </button>
          </div>
        </motion.div>
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

