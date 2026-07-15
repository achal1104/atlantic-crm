'use client';
import { useState } from 'react';
import { useFollowUps, useCreateFollowUp, useCompleteFollowUp } from '@/lib/hooks';
import { CheckCircle, Plus, Clock } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  CALL: 'bg-blue-100 text-blue-700',
  MEETING: 'bg-purple-100 text-purple-700',
  REMINDER: 'bg-yellow-100 text-yellow-700',
  EMAIL: 'bg-green-100 text-green-700',
};

export default function FollowUpsPage() {
  const { data: followUps = [], isLoading } = useFollowUps();
  const createFollowUp = useCreateFollowUp();
  const completeFollowUp = useCompleteFollowUp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ leadId: '', type: 'CALL', notes: '', scheduledAt: '' });
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createFollowUp.mutateAsync(form);
      setShowForm(false);
      setForm({ leadId: '', type: 'CALL', notes: '', scheduledAt: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create follow-up.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" /> New Follow-up
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Schedule Follow-up</h2>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead ID</label>
              <input value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Paste lead ID" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600">
                {['CALL', 'MEETING', 'REMINDER', 'EMAIL'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled At</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Optional notes" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={createFollowUp.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">
                {createFollowUp.isPending ? 'Saving...' : 'Schedule'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading follow-ups...</div>
        ) : followUps.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No follow-ups scheduled yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {followUps.map((f: any) => (
              <li key={f.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Clock className={`w-5 h-5 ${f.isCompleted ? 'text-green-500' : 'text-blue-500'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[f.type]}`}>{f.type}</span>
                      <span className="text-sm font-medium text-gray-900">{f.lead?.name}</span>
                    </div>
                    {f.notes && <p className="text-sm text-gray-500 mt-0.5">{f.notes}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(f.scheduledAt).toLocaleString()}</p>
                  </div>
                </div>
                {!f.isCompleted ? (
                  <button onClick={() => completeFollowUp.mutate(f.id)}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
                    <CheckCircle className="w-4 h-4" /> Complete
                  </button>
                ) : (
                  <span className="text-xs text-green-600 font-medium">✓ Done</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
