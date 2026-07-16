'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { api } from '@/lib/api';

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setError(''); setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password: form.password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
    <div className="text-center">
      <p className="text-red-600 text-sm mb-4">Invalid reset link.</p>
      <Link href="/forgot-password" className="text-blue-600 text-sm font-medium">Request a new one</Link>
    </div>
  );

  return success ? (
    <div className="text-center">
      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Password reset!</h2>
      <p className="text-gray-500 text-sm">Redirecting to login...</p>
    </div>
  ) : (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Set new password</h1>
      <p className="text-gray-500 text-sm mb-6">Must be at least 6 characters.</p>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            required minLength={6} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            required minLength={6} />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg"><Building2 className="w-5 h-5 text-white" /></div>
          <span className="text-lg font-bold text-gray-900">Atlantic AI CRM</span>
        </div>
        <Suspense fallback={<div className="text-gray-400 text-sm">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
