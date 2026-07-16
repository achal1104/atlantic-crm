'use client';
import { Users, TrendingUp, PhoneCall, DollarSign, XCircle, Activity, CalendarCheck } from 'lucide-react';
import { useDashboardStats, useAnalytics } from '@/lib/hooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const { data: analytics } = useAnalytics();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="xl:col-span-1">
          <StatCard title="Total Leads" value={isLoading ? '...' : data?.totalLeads} icon={Users} sub="All time" color="bg-blue-500" />
        </div>
        <div className="xl:col-span-1">
          <StatCard title="Today's Leads" value={isLoading ? '...' : data?.todayLeads} icon={PhoneCall} sub="Added today" color="bg-indigo-500" />
        </div>
        <div className="xl:col-span-1">
          <StatCard title="Converted" value={isLoading ? '...' : data?.convertedLeads} icon={TrendingUp} sub="Status: WON" color="bg-green-500" />
        </div>
        <div className="xl:col-span-1">
          <StatCard title="Lost Leads" value={isLoading ? '...' : data?.lostLeads} icon={XCircle} sub="Status: LOST" color="bg-red-500" />
        </div>
        <div className="xl:col-span-1">
          <StatCard title="Appointments" value={isLoading ? '...' : data?.appointments} icon={CalendarCheck} sub="Upcoming follow-ups" color="bg-purple-500" />
        </div>
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
              <div className="p-2 rounded-lg bg-emerald-500"><DollarSign className="w-5 h-5 text-white" /></div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${isLoading ? '...' : (data?.revenue ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">From WON leads</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mini bar chart — daily leads last 30 days */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Leads (Last 30 Days)</h2>
          {analytics?.dailyLeads?.length ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={analytics.dailyLeads}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={24} />
                <Tooltip formatter={(v) => [v, 'Leads']} labelFormatter={(l) => l} />
                <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sm text-gray-400">No data yet</div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
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
