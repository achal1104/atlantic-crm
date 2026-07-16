'use client';
import { useAnalytics } from '@/lib/hooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
          <p className="text-4xl font-bold text-green-600">{data?.conversionRate}%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Lead Sources</p>
          <p className="text-4xl font-bold text-blue-600">{data?.bySource?.length ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Active Statuses</p>
          <p className="text-4xl font-bold text-indigo-600">{data?.byStatus?.length ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Leads */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Daily Leads (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.dailyLeads ?? []}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Leads */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Monthly Leads (Last 12 Months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.monthlyLeads ?? []}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Source */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Leads by Source</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data?.bySource ?? []} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={80} label>
                {(data?.bySource ?? []).map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Status */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Leads by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.byStatus ?? []} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={130} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Sales Performance (WON Leads per Rep)</h2>
          {data?.salesPerformance?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.salesPerformance}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="won" name="Won" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Total" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">No sales data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
