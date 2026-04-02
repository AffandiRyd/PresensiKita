import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center">
            <CheckCircle className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-brand-dark">PresensiKita</span>
        </div>
        <Link 
          to="/login" 
          className="px-6 py-2 bg-brand-dark text-white rounded-full font-medium hover:bg-brand-light transition-colors"
        >
          Masuk
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-16 md:py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Absensi Digital <br />
            <span className="text-gradient-brand">Lebih Cerdas, Lebih Cepat.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg">
            PresensiKita adalah solusi modern untuk pengelolaan kehadiran siswa dan guru. 
            Tinggalkan kertas, beralih ke sistem digital yang transparan dan akurat.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-brand-dark text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              Mulai Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-brand-sky/20 blur-3xl rounded-full"></div>
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
            alt="Students collaborating" 
            className="relative rounded-2xl shadow-2xl border border-slate-200"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </header>

      {/* Features */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Kenapa Memilih PresensiKita?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Kami menyediakan fitur lengkap untuk memudahkan administrasi sekolah Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-brand-dark" />,
                title: "Manajemen Siswa",
                desc: "Kelola data siswa dengan mudah dan terstruktur dalam satu platform."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-brand-dark" />,
                title: "Rekap Otomatis",
                desc: "Dapatkan laporan kehadiran harian, mingguan, hingga bulanan secara instan."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-brand-dark" />,
                title: "Akses Berbasis Peran",
                desc: "Keamanan data terjamin dengan pembatasan akses untuk Admin dan Guru."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
              <CheckCircle className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-brand-dark">PresensiKita</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 PresensiKita. Dibuat dengan ❤️ untuk pendidikan Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
