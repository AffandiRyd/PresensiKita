import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase, Profile } from '../lib/supabase';
import { cn } from '../lib/utils';
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
  User
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
          // If no profile exists, check if this is the first user
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-brand text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">PresensiKita</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  location.pathname === item.path 
                    ? "bg-white/20 text-white shadow-lg" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {location.pathname === item.path && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl">
              <div className="w-10 h-10 bg-brand-sky rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{profile?.full_name || 'Loading...'}</p>
                <p className="text-xs text-white/60 capitalize">{profile?.role || '...'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-slate-900">{profile?.full_name}</p>
              <p className="text-xs text-slate-500 capitalize">{profile?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ profile }} />
        </div>
      </main>
    </div>
  );
}
