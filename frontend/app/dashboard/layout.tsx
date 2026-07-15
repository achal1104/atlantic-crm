// frontend/app/dashboard/layout.tsx

import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Kanban,
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Building2
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Building2 className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-lg font-bold text-gray-900">Atlantic AI</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 text-blue-700">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link href="/dashboard/leads" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <Users className="w-5 h-5 mr-3" /> Leads
          </Link>
          <Link href="/dashboard/pipeline" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <Kanban className="w-5 h-5 mr-3" /> Pipeline
          </Link>
          <Link href="/dashboard/analytics" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <BarChart3 className="w-5 h-5 mr-3" /> Analytics
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link href="/dashboard/settings" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex-1 max-w-lg flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search leads, phone numbers..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>
          
          <div className="flex items-center space-x-4 ml-4">
            <button className="text-gray-500 hover:text-blue-600 transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer">
              AS
            </div>
          </div>
        </header>

        {/* Page Content goes here */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}