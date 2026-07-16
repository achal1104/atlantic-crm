'use client';
import { useState, useEffect } from 'react';
import { useProfile, useUpdateProfile, useChangePassword } from '@/lib/hooks';
import { UserCircle } from 'lucide-react';

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [profileForm, setProfileForm] = useState({ name: '', avatar: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, avatar: user.avatar || '' });
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name: profileForm.name, avatar: profileForm.avatar });
      setProfileMsg('Profile updated successfully!');
    } catch { setProfileMsg('Failed to update profile.'); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { setPwMsg('Passwords do not match.'); return; }
    try {
      await changePassword.mutateAsync({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err: any) {
      setPwMsg(err.response?.data?.message || 'Failed to change password.');
    }
  };

  if (isLoading) return <div className="text-gray-400 text-center mt-20">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 placeholder:text-gray-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input value={profileForm.avatar} onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 placeholder:text-gray-400"
              placeholder="https://..." />
          </div>
          {profileMsg && <p className="text-sm text-green-600">{profileMsg}</p>}
          <button type="submit" disabled={updateProfile.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {(['currentPassword', 'newPassword', 'confirm'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
              </label>
              <input type="password" value={pwForm[field]} onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 placeholder:text-gray-400"
                required minLength={6} />
            </div>
          ))}
          {pwMsg && <p className={`text-sm ${pwMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{pwMsg}</p>}
          <button type="submit" disabled={changePassword.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">
            {changePassword.isPending ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
