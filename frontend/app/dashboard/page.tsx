'use client';
import { Users, TrendingUp, PhoneCall, DollarSign, XCircle, CalendarCheck, Activity, ArrowUpRight, Zap } from 'lucide-react';
import { useDashboardStats, useAnalytics } from '@/lib/hooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="font-bold text-white">{payload[0].value} leads</p>
    </div>
  );
};

function StatCard({ label, sub, value, loading, gradient, glow, icon: Icon }: {
  label: string; sub: string; value: any; loading: boolean;
  gradient: string; glow: string; icon: any;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm card-hover">
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg ${glow}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-0.5 tabular-nums">
        {loading ? <div className="skeleton h-7 w-12" /> : value}
      </div>
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();
  const { data: analytics } = useAnalytics();

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your leads today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total Leads" sub="All time" value={data?.totalLeads ?? 0} loading={isLoading}
          gradient="from-indigo-500 to-indigo-600" glow="shadow-indigo-500/25" icon={Users} />
        <StatCard label="Today's Leads" sub="Added today" value={data?.todayLeads ?? 0} loading={isLoading}
          gradient="from-violet-500 to-purple-600" glow="shadow-violet-500/25" icon={PhoneCall} />
        <StatCard label="Converted" sub="Status: WON" value={data?.convertedLeads ?? 0} loading={isLoading}
          gradient="from-emerald-500 to-teal-600" glow="shadow-emerald-500/25" icon={TrendingUp} />
        <StatCard label="Lost Leads" sub="Status: LOST" value={data?.lostLeads ?? 0} loading={isLoading}
          gradient="from-rose-500 to-red-600" glow="shadow-rose-500/25" icon={XCircle} />
        <StatCard label="Appointments" sub="Upcoming" value={data?.appointments ?? 0} loading={isLoading}
          gradient="from-amber-500 to-orange-500" glow="shadow-amber-500/25" icon={CalendarCheck} />
        <StatCard label="Revenue" sub="From WON leads" value={`$${Number(data?.revenue ?? 0).toLocaleString()}`} loading={isLoading}
          gradient="from-cyan-500 to-blue-500" glow="shadow-cyan-500/25" icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Lead Activity</h2>
              <p className="text-xs text-slate-400 mt-0.5">Daily leads — last 30 days</p>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600">Daily</span>
            </div>
          </div>
          {analytics?.dailyLeads?.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.dailyLeads} barSize={7}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} width={20} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc', radius: 4 }} />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center">
              <BarChart className="w-10 h-10 mb-2 text-slate-200" />
              <p className="text-sm text-slate-400">No data yet</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest updates</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="skeleton w-2 h-2 rounded-full mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3 w-3/4" />
                    <div className="skeleton h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentActivity?.length ? (
            <ul className="space-y-3">
              {data.recentActivity.slice(0, 6).map((log: any, i: number) => (
                <li key={log.id} className="flex items-start gap-3" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3 h-3 text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {log.action}
                      {log.lead && <span className="font-normal text-slate-400"> — {log.lead.name}</span>}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-32">
              <Activity className="w-8 h-8 mb-2 text-slate-200" />
              <p className="text-sm text-slate-400">No activity yet</p>
            </div>
          )}
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="rounded-2xl p-5 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
            <p className="text-indigo-200 text-xs font-semibold mb-1 uppercase tracking-wider">Conversion Rate</p>
            <p className="text-4xl font-bold">{analytics.conversionRate}%</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-xs text-indigo-200">WON / Total leads</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm card-hover">
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Lead Sources</p>
            <p className="text-4xl font-bold text-slate-900">{analytics.bySource?.length ?? 0}</p>
            <p className="text-xs text-slate-400 mt-2">Active acquisition channels</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm card-hover">
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Pipeline Stages</p>
            <p className="text-4xl font-bold text-slate-900">{analytics.byStatus?.length ?? 0}</p>
            <p className="text-xs text-slate-400 mt-2">Active lead statuses</p>
          </div>
        </div>
      )}
    </div>
  );
}
