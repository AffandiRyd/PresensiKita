import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase, Profile } from '../lib/supabase';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  ClipboardList, 
  GraduationCap, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  User,
  Bell,
  CheckCircle
} from 'lucide-react';

export default function AppLayout() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
        } else {
          const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          const role = count === 0 ? 'admin' : 'guru';
          
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert([{ id: user.id, full_name: user.email?.split('@')[0], role }])
            .select()
            .single();
          
          if (newProfile) setProfile(newProfile);
        }
      }
    }
    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/app', roles: ['admin', 'guru'] },
    { icon: <UserCheck className="w-5 h-5" />, label: 'Absensi Guru', path: '/app/teacher-attendance', roles: ['admin', 'guru'] },
    { icon: <Users className="w-5 h-5" />, label: 'Absensi Siswa', path: '/app/student-attendance', roles: ['admin', 'guru'] },
    { icon: <ClipboardList className="w-5 h-5" />, label: 'Rekap Guru', path: '/app/recap-teacher', roles: ['admin'] },
    { icon: <ClipboardList className="w-5 h-5" />, label: 'Rekap Siswa', path: '/app/recap-student', roles: ['admin', 'guru'] },
    { icon: <GraduationCap className="w-5 h-5" />, label: 'Data Siswa', path: '/app/students', roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => profile && item.roles.includes(profile.role));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-brand-dark text-white transition-all duration-500 ease-[0.22,1,0.36,1] lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none border-r border-white/5",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform hover:rotate-0">
                <CheckCircle className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-extrabold tracking-tight">PresensiKita</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {filteredMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group",
                    isActive 
                      ? "bg-white/10 text-white shadow-premium" 
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-brand-light" : "text-white/40"
                  )}>
                    {item.icon}
                  </span>
                  <span className="font-bold tracking-tight">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-6 bg-brand-light rounded-r-full"
                    />
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white/40" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-6">
            <div className="px-5 py-5 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-4 relative group hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-light to-brand-primary rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate leading-tight uppercase tracking-tight">{profile?.full_name || 'Loading...'}</p>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-0.5">{profile?.role || '...'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#fbfbfd]">
        {/* Header */}
        <header className="h-20 glass-morphism flex items-center justify-between px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-3 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-display font-bold text-slate-800 tracking-tight hidden sm:block">
              {filteredMenu.find(m => m.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-accent rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-5 py-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm tracking-tight group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 blur-[100px] rounded-full -z-10"></div>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet context={{ profile }} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
