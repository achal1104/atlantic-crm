'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Kanban, BarChart3, Building2, LogOut, CalendarCheck, UserCircle, Menu, Bell } from 'lucide-react';
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

function NotificationBell() {
  const { data: notifications = [] } = useNotifications();
  const markAll = useMarkAllRead();
  const markOne = useMarkOneRead();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n: any) => !n.isRead).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const TYPE_COLORS: Record<string, string> = {
    LEAD_ASSIGNED: 'bg-blue-100 text-blue-700',
    LEAD_UPDATED: 'bg-yellow-100 text-yellow-700',
    FOLLOWUP_REMINDER: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative text-gray-500 hover:text-blue-600">
        <Bell className="w-6 h-6" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Notifications</span>
            {unread > 0 && (
              <button onClick={() => markAll.mutate()} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-gray-400">No notifications</li>
            ) : notifications.map((n: any) => (
              <li key={n.id}
                onClick={() => { if (!n.isRead) markOne.mutate(n.id); }}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/40' : ''}`}>
                <div className="flex items-start gap-2">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${TYPE_COLORS[n.type] ?? 'bg-gray-100 text-gray-600'}`}>
                    {n.type.replace('_', ' ')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { clearAuthToken(); router.push('/login'); };
  const [initials, setInitials] = useState('U');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const i = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';
    setInitials(i);
  }, []);

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Building2 className="w-6 h-6 text-blue-600 mr-2" />
        <span className="text-lg font-bold text-gray-900">Atlantic AI</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Icon className="w-5 h-5 mr-3" />{label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5 mr-3" />Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 md:ml-64">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <button className="md:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 md:flex-none" />
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Link href="/dashboard/profile">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
                {initials}
              </div>
            </Link>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
