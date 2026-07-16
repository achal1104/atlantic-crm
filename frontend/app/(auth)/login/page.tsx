'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { api, setAuthToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      setAuthToken(res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      const d = err.response?.data;
      setError(d?.message || d?.errors?.[0]?.msg || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f172a 100%)' }}>
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 xl:px-16 relative z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-sm w-full mx-auto relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow-indigo">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Atlantic AI CRM</span>
              <span className="block text-[10px] text-indigo-400 font-medium tracking-widest uppercase">Lead Management Platform</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">Sign in to your workspace to continue.</p>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 text-sm outline-none focus:border-indigo-500 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 text-sm outline-none focus:border-indigo-500 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Create one free</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-[55%] items-center justify-center relative overflow-hidden p-12">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-lg w-full">
          <div className="glass rounded-3xl p-8 mb-6 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Atlantic AI CRM</p>
                <p className="text-slate-400 text-xs">Lead Management Platform</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-bold text-indigo-400">2,847</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Total Leads</p>
              </div>
              <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-bold text-emerald-400">384</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Converted</p>
              </div>
              <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-bold text-purple-400">$1.2M</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Revenue</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { stage: 'Qualified', pct: 78, color: 'bg-indigo-500' },
                { stage: 'Proposal Sent', pct: 52, color: 'bg-purple-500' },
                { stage: 'Won', pct: 34, color: 'bg-emerald-500' },
              ].map(({ stage, pct, color }) => (
                <div key={stage} className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs w-24 shrink-0">{stage}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-slate-400 text-xs w-8 text-right">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-2xl px-4 py-3 border border-white/5 hover:border-indigo-500/30 transition-all" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">AI Lead Scoring</p>
                <p className="text-slate-500 text-[11px]">Prioritize high-value leads automatically</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl px-4 py-3 border border-white/5 hover:border-indigo-500/30 transition-all" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Team Pipeline</p>
                <p className="text-slate-500 text-[11px]">Kanban board with drag & drop stages</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl px-4 py-3 border border-white/5 hover:border-indigo-500/30 transition-all" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Live Analytics</p>
                <p className="text-slate-500 text-[11px]">Real-time conversion & revenue tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
