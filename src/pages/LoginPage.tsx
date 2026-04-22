import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import PurpleAestheticImage from '../components/PurpleAestheticImage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Periksa email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:block relative overflow-hidden bg-brand-dark">
        <PurpleAestheticImage className="absolute inset-0 w-full h-full opacity-60" />
        <div className="absolute inset-0 bg-gradient-brand opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
        <div className="relative z-10 h-full flex flex-col justify-between p-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <CheckCircle className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-display font-extrabold text-white tracking-tight">PresensiKita</span>
          </Link>
          
          <div className="max-w-md">
            <h2 className="text-5xl font-display font-extrabold text-white leading-tight mb-6">
              Kelola kehadiran dengan <span className="text-brand-light">satu sentuhan.</span>
            </h2>
            <p className="text-white/70 text-lg font-medium leading-relaxed">
              Platform modern untuk guru dan admin sekolah yang mengedepankan efisiensi dan transparansi data.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-white/80 text-xs font-bold uppercase tracking-widest">
              v2.0.4 - Secure
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-[#fbfbfd]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-10 lg:hidden flex justify-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                <CheckCircle className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-display font-bold text-brand-dark">PresensiKita</span>
            </Link>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100">
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-2xl mb-6">
                <LogIn className="text-brand-primary w-8 h-8" />
              </div>
              <h1 className="text-3xl font-display font-extrabold text-slate-900 mb-2">Selamat Datang</h1>
              <p className="text-slate-500 font-medium tracking-tight">Silakan masuk untuk mengakses dashboard Anda</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 text-rose-600 text-sm font-medium"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Alamat Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-medium text-slate-900"
                    placeholder="nama@sekolah.sch.id"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-700 tracking-tight">Kata Sandi</label>
                  <a href="#" className="text-xs font-bold text-brand-primary hover:underline">Lupa sandi?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-medium text-slate-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {loading ? 'Memproses...' : (
                  <>
                    Masuk Sekarang
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-slate-50 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
