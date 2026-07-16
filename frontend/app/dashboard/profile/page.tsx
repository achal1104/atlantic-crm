'use client';
import { useState, useEffect, useRef } from 'react';
import { useProfile, useUpdateProfile, useChangePassword } from '@/lib/hooks';
import { Camera, Shield, User, CheckCircle, AlertCircle, Zap, ImageIcon } from 'lucide-react';

const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition-all';
const labelCls = 'block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest';

const ROLE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  ADMIN:           { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
  MANAGER:         { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200' },
  SALES_EXECUTIVE: { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200' },
};

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({ name: '', avatar: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, avatar: user.avatar || '' });
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setProfileMsg({ type: 'error', text: 'Image must be under 2MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfileForm(f => ({ ...f, avatar: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name: profileForm.name, avatar: profileForm.avatar });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMsg(null), 3000);
    } catch { setProfileMsg({ type: 'error', text: 'Failed to update profile.' }); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg({ type: 'success', text: 'Password changed successfully!' });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      setTimeout(() => setPwMsg(null), 3000);
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    </div>
  );

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const roleStyle = ROLE_STYLES[user?.role ?? ''] ?? { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };

  return (
    <div className="space-y-5 max-w-2xl animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-white/20">
            <Zap className="w-3 h-3 text-white" />
            <span className="text-white text-[10px] font-bold">Atlantic AI CRM</span>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-5">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {profileForm.avatar ? (
                <img src={profileForm.avatar} alt="avatar" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
              {user?.role?.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Click avatar to upload a new photo
            </p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className={inputCls} placeholder="Your full name" required />
            </div>
            {profileMsg && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${
                profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                {profileMsg.text}
              </div>
            )}
            <button type="submit" disabled={updateProfile.isPending} className="btn-primary">
              <User className="w-4 h-4" />
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-sm">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
            <p className="text-xs text-slate-400">Keep your account secure with a strong password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              placeholder="Enter current password" className={inputCls} required minLength={6} />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
              placeholder="Min. 6 characters" className={inputCls} required minLength={6} />
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
              placeholder="Repeat new password" className={inputCls} required minLength={6} />
          </div>
          {pwMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${
              pwMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {pwMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {pwMsg.text}
            </div>
          )}
          <button type="submit" disabled={changePassword.isPending}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-colors shadow-sm">
            <Shield className="w-4 h-4" />
            {changePassword.isPending ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
