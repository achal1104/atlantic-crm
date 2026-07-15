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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Daily Leads (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.dailyLeads ?? []}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Leads by Source</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data?.bySource ?? []} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={90} label>
                {(data?.bySource ?? []).map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
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
      </div>
    </div>
  );
}
