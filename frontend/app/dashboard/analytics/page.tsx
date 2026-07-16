'use client';
import { useAnalytics } from '@/lib/hooks';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart2, Users, ArrowUpRight } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899'];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="font-bold text-white">{payload[0].value}</p>
    </div>
  );
};

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track performance, trends, and team output.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="flex items-center justify-between mb-3">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Conversion Rate</p>
            <TrendingUp className="w-4 h-4 text-emerald-200" />
          </div>
          <p className="text-4xl font-bold">{data?.conversionRate}%</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-200" />
            <span className="text-xs text-emerald-200">WON / Total leads</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Lead Sources</p>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <PieIcon className="w-3.5 h-3.5 text-indigo-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900">{data?.bySource?.length ?? 0}</p>
          <p className="text-xs text-slate-400 mt-2">Active acquisition channels</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pipeline Stages</p>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5 text-purple-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900">{data?.byStatus?.length ?? 0}</p>
          <p className="text-xs text-slate-400 mt-2">Active lead statuses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Daily Leads</h2>
          <p className="text-xs text-slate-400 mb-4">Last 30 days</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.dailyLeads ?? []} barSize={7}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} width={20} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" fill="url(#grad1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Monthly Leads</h2>
          <p className="text-xs text-slate-400 mb-4">Last 12 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.monthlyLeads ?? []} barSize={16}>
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} width={20} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" fill="url(#grad2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Leads by Source</h2>
          <p className="text-xs text-slate-400 mb-4">Channel distribution</p>
          {data?.bySource?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.bySource} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                  {data.bySource.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] flex items-center justify-center text-slate-300 text-sm">No data yet</div>}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Leads by Status</h2>
          <p className="text-xs text-slate-400 mb-4">Pipeline distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.byStatus ?? []} layout="vertical" barSize={10}>
              <defs>
                <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="status" tick={{ fontSize: 10, fill: '#64748b' }} width={130} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" fill="url(#grad3)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold text-slate-900">Sales Performance</h2>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4">WON leads per sales rep</p>
        {data?.salesPerformance?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.salesPerformance} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} width={20} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="total" name="Total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="won" name="Won" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="h-[220px] flex items-center justify-center text-slate-300 text-sm">No sales data yet</div>}
      </div>
    </div>
  );
}
