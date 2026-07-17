'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { api, setAuthToken } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      setAuthToken(res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err: any) {
      const d = err.response?.data;
      setError(d?.message || d?.errors?.[0]?.msg || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f172a 100%)' }}>
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 xl:px-16 relative z-10">
        <div className="absolute top-1/3 left-1/4 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

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

          <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-slate-400 text-sm mb-8">Start managing your leads in minutes.</p>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="John Smith"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                  minLength={6}
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
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : (
                <><span>Create account</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-[55%] items-center justify-center relative overflow-hidden p-12">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-600/25 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md w-full">
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
            Everything your sales team needs.
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            From lead capture to deal closure — Atlantic AI CRM gives your team the tools to move faster and close more.
          </p>

          <div className="space-y-3 mb-8">
            {[
              'Full lead lifecycle management',
              'Kanban pipeline with drag & drop',
              'Real-time analytics & reporting',
              'Role-based access control',
              'Email notifications & reminders',
            ].map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm">{perk}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4 border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {(['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'] as const).map((color, i) => (
                  <div
                    key={color}
                    className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: color }}
                  >
                    {['A', 'B', 'C', 'D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Join 500+ sales teams</p>
                <p className="text-slate-500 text-[11px]">already using Atlantic AI CRM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
