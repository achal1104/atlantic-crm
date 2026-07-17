'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Kanban, BarChart3, LogOut,
  CalendarCheck, UserCircle, Menu, Bell, Zap, X,
} from 'lucide-react';
import { clearAuthToken } from '@/lib/api';
import { useState, useRef, useEffect } from 'react';
import { useNotifications, useMarkAllRead, useMarkOneRead } from '@/lib/hooks';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/dashboard/followups', label: 'Follow-ups', icon: CalendarCheck },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
];

const NOTIF_COLORS: Record<string, string> = {
  LEAD_ASSIGNED: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  LEAD_UPDATED: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  FOLLOWUP_REMINDER: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
};

function NotificationBell() {
  const { data: notifications = [] } = useNotifications();
  const markAll = useMarkAllRead();
  const markOne = useMarkOneRead();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n: any) => !n.isRead).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unread > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping opacity-75" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 z-50 overflow-hidden animate-fade-up">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Notifications</span>
              {unread > 0 && (
                <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">{unread}</span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={() => markAll.mutate()} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-10 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-400">All caught up!</p>
              </li>
            ) : notifications.map((n: any) => (
              <li key={n.id} onClick={() => { if (!n.isRead) markOne.mutate(n.id); }}
                className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${!n.isRead ? 'bg-indigo-50/40' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 ${NOTIF_COLORS[n.type] ?? 'bg-slate-100 text-slate-500'}`}>
                    {n.type.replace(/_/g, ' ')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1.5" />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full sidebar-dark">
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow-indigo">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight">Atlantic AI</span>
            <span className="block text-[9px] text-indigo-400 font-medium tracking-widest uppercase">CRM Platform</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em] px-3 pb-2">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
              <Icon style={{ width: 16, height: 16 }} className={`shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-white' : ''}`} />
              <span className="flex-1">{label}</span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-white/60" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => { clearAuthToken(); router.push('/login'); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all group"
        >
          <LogOut style={{ width: 16, height: 16 }} className="shrink-0 group-hover:scale-110 transition-transform" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initials, setInitials] = useState('U');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setInitials(user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U');
    setUserName(user?.name || '');
    setUserRole(user?.role?.replace(/_/g, ' ') || '');
  }, []);

  return (
    <div className="min-h-screen flex" style={{ background: '#f1f5f9' }}>
      <aside className="w-56 hidden md:flex flex-col fixed h-full z-20">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 flex flex-col shadow-2xl">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 md:ml-56">
        <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-5 sticky top-0 z-10">
          <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(true)}>
            <Menu className="w-4 h-4" />
          </button>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500 font-medium">All systems operational</span>
          </div>
          <div className="flex items-center gap-1.5">
            <NotificationBell />
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <Link href="/dashboard/profile"
              className="flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 py-1.5 transition-colors group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-700 leading-none">{userName.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{userRole}</p>
              </div>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
