import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { Settings } from 'lucide-react';
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

  useEffect(() => {
    if (!isConfigured) {
      const demoUser = localStorage.getItem('presensikita_demo_user');
      if (demoUser) {
        setSession({ user: JSON.parse(demoUser) });
      }
      setLoading(false);
      return;
    }

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        console.error('Supabase connection error:', err);
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

  if (!isConfigured && !localStorage.getItem('presensikita_demo_mode')) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings className="w-8 h-8 animate-[spin_3s_linear_infinite]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Konfigurasi Diperlukan</h1>
          <p className="text-slate-600 mb-6">
            Anda perlu mengatur <strong>Supabase URL</strong> dan <strong>Anon Key</strong> di panel <strong>Secrets</strong> AI Studio untuk menjalankan database asli.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => {
                localStorage.setItem('presensikita_demo_mode', 'true');
                window.location.reload();
              }}
              className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-light transition-all shadow-md"
            >
              Coba Mode Demo (Tanpa Database)
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Atau Hubungkan Supabase</span></div>
            </div>

            <div className="space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-mono">
              <p className="text-slate-500"># Tambahkan di Secrets:</p>
              <p className="text-brand-dark">VITE_SUPABASE_URL=...</p>
              <p className="text-brand-dark">VITE_SUPABASE_ANON_KEY=...</p>
            </div>
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

