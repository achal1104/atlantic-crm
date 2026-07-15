'use client';
import { Users, TrendingUp, PhoneCall, DollarSign, XCircle, Activity } from 'lucide-react';
import { useDashboardStats } from '@/lib/hooks';

const StatCard = ({ title, value, icon: Icon, sub, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className={`p-2 rounded-lg ${color}`}><Icon className="w-5 h-5 text-white" /></div>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value ?? '—'}</div>
    <p className="text-xs text-gray-500 mt-1">{sub}</p>
  </div>
);

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value={isLoading ? '...' : data?.totalLeads} icon={Users} sub="All time" color="bg-blue-500" />
        <StatCard title="Today's Leads" value={isLoading ? '...' : data?.todayLeads} icon={PhoneCall} sub="Added today" color="bg-indigo-500" />
        <StatCard title="Converted" value={isLoading ? '...' : data?.convertedLeads} icon={TrendingUp} sub="Status: WON" color="bg-green-500" />
        <StatCard title="Lost Leads" value={isLoading ? '...' : data?.lostLeads} icon={XCircle} sub="Status: LOST" color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Total Revenue</h2>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${isLoading ? '...' : (data?.revenue ?? 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Sum of budgets from WON leads</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : data?.recentActivity?.length ? (
            <ul className="space-y-3">
              {data.recentActivity.slice(0, 6).map((log: any) => (
                <li key={log.id} className="flex items-start gap-3 text-sm">
                  <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                  <div>
                    <span className="font-medium text-gray-800">{log.action}</span>
                    {log.lead && <span className="text-gray-500"> — {log.lead.name}</span>}
                    <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}
