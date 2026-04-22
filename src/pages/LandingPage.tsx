import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, BarChart3, ShieldCheck, ArrowRight, Zap, Star, Layout } from 'lucide-react';

import PurpleAestheticImage from '../components/PurpleAestheticImage';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
              <CheckCircle className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-extrabold text-brand-dark tracking-tight">PresensiKita</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-brand-primary transition-colors">Fitur</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-brand-primary transition-colors">Tentang</a>
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-brand-dark text-white rounded-full font-semibold hover:bg-brand-primary transition-all shadow-md active:scale-95"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-accent/5 blur-[100px] rounded-full -z-10"></div>

        <motion.div 
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full mb-6 border border-brand-primary/20">
            <Star className="w-4 h-4 text-brand-primary fill-brand-primary" />
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest leading-none">Pilihan No. 1 Sekolah Modern</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-slate-900 leading-[1.1] md:leading-[0.9] mb-8 tracking-tighter">
            Absensi <br className="hidden md:block" />
            Digital <span className="text-gradient-brand">Tanpa Batas.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Revolusi pengelolaan kehadiran siswa dan guru dengan sistem digital yang transparan, akurat, dan sangat cepat. Dirancang untuk efisiensi sekolah masa depan.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link 
              to="/login" 
              className="px-8 md:px-10 py-4 md:py-5 bg-brand-dark text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/20 hover:-translate-y-1 group"
            >
              Mulai Gratis Sekarang 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-5 relative group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl border border-white/20">
            <PurpleAestheticImage className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-brand opacity-10" />
          </div>
            
          {/* Floating Info Cards - Moved outside overflow-hidden */}
          <motion.div 
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -right-6 top-12 bg-white/10 backdrop-blur-3xl p-6 rounded-[2.5rem] shadow-premium-dark border border-white/20 z-20 min-w-[240px] cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">LIVE STATUS</span>
                <p className="text-2xl font-display font-black text-white leading-tight">98% Hadir</p>
              </div>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="w-[98%] h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.7)]"></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.05, y: 5 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -left-12 bottom-12 bg-white/10 backdrop-blur-3xl p-6 rounded-[2.5rem] shadow-premium-dark border border-white/20 z-20 min-w-[220px] cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center border border-brand-primary/30">
                <Users className="w-6 h-6 text-brand-light" />
              </div>
              <div>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">TOTAL SISWA</span>
                <p className="text-4xl font-display font-black text-white leading-none">1,240+</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* Stats Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
          {[
            { label: 'Sekolah Aktif', value: '500+' },
            { label: 'Siswa Terdaftar', value: '250k+' },
            { label: 'Data Presensi', value: '1M+' },
            { label: 'Efisiensi Waktu', value: '85%' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-display font-extrabold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 mb-6 tracking-tight">Kekuatan Presensi digital.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Dirancang untuk memudahkan setiap orang di sekolah, dari admin hingga guru.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Layout className="w-10 h-10 text-brand-primary" />,
                title: "Dashboard Intuitif",
                desc: "Antarmuka modern yang memudahkan pemantauan kehadiran secara real-time.",
                color: "bg-indigo-50"
              },
              {
                icon: <BarChart3 className="w-10 h-10 text-brand-accent" />,
                title: "Laporan Cerdas",
                desc: "Export data presensi dalam satu klik, rapi dan siap digunakan untuk evaluasi.",
                color: "bg-rose-50"
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-brand-sky" />,
                title: "Keamanan Tinggi",
                desc: "Data tersimpan aman di cloud dengan enkripsi tingkat lanjut.",
                color: "bg-sky-50"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group p-10 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-premium transition-all relative overflow-hidden"
              >
                <div className={`w-20 h-20 ${feature.color} rounded-x2l flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-[1720px] mx-auto rounded-[3rem] bg-brand-dark p-12 md:p-20 text-center relative overflow-hidden shadow-premium">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-brand opacity-20"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-light rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-accent rounded-full blur-[100px] opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-8">
              Siap Bertransformasi Digital?
            </h2>
            <p className="text-brand-light font-medium text-base md:text-lg mb-12 max-w-2xl mx-auto italic">
              Gabung dengan ratusan sekolah yang sudah meningkatkan efisiensi mereka hari ini.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-white text-brand-dark rounded-2xl font-bold hover:bg-brand-light hover:text-white transition-all shadow-xl w-full sm:w-auto"
            >
              Mulai Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 lg:px-12 border-t border-slate-100 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-display font-extrabold text-brand-dark">PresensiKita</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                Platform absensi digital terpadu untuk ekosistem pendidikan yang lebih modern dan transparan.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-12 md:gap-24">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Navigasi</h4>
                <ul className="space-y-4 text-sm font-semibold text-slate-600">
                  <li><a href="#" className="hover:text-brand-primary transition-colors">Beranda</a></li>
                  <li><a href="#features" className="hover:text-brand-primary transition-colors">Fitur</a></li>
                  <li><a href="#" className="hover:text-brand-primary transition-colors">Tentang Kami</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Bantuan</h4>
                <ul className="space-y-4 text-sm font-semibold text-slate-600">
                  <li><a href="#" className="hover:text-brand-primary transition-colors">Kontak</a></li>
                  <li><a href="#" className="hover:text-brand-primary transition-colors">Keamanan</a></li>
                  <li><a href="#" className="hover:text-brand-primary transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-slate-50 gap-6">
            <p className="text-slate-400 text-sm font-medium">
              © 2026 PresensiKita. Dibuat dengan ❤️ di Indonesia.
            </p>
            <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-brand-primary">Privacy Policy</a>
              <a href="#" className="hover:text-brand-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
