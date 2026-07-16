'use client';
import { useState } from 'react';
import { useFollowUps, useCreateFollowUp, useCompleteFollowUp, useLeads } from '@/lib/hooks';
import { CheckCircle, Plus, Phone, Users, Bell, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  CALL: 'bg-blue-100 text-blue-700',
  MEETING: 'bg-purple-100 text-purple-700',
  REMINDER: 'bg-yellow-100 text-yellow-700',
  EMAIL: 'bg-green-100 text-green-700',
};

const TYPE_ICONS: Record<string, any> = {
  CALL: Phone, MEETING: Users, REMINDER: Bell, EMAIL: Mail,
};

export default function FollowUpsPage() {
  const { data: allFollowUps = [], isLoading } = useFollowUps();
  const { data: leadsData } = useLeads({ limit: 100 });
  const leads = leadsData?.data ?? [];
  const createFollowUp = useCreateFollowUp();
  const completeFollowUp = useCompleteFollowUp();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ leadId: '', type: 'CALL', notes: '', scheduledAt: '' });
  const [error, setError] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());

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

  const toggleLead = (id: string) => {
    setExpandedLeads(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Filter follow-ups
  const filtered = selectedLeadId
    ? allFollowUps.filter((f: any) => f.leadId === selectedLeadId)
    : allFollowUps;

  // Group by lead for timeline view
  const grouped: Record<string, any[]> = {};
  filtered.forEach((f: any) => {
    const key = f.leadId;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(f);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          <Plus className="w-4 h-4" /> New Follow-up
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Schedule Follow-up</h2>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead</label>
              <select value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm" required>
                <option value="">Select a lead</option>
                {leads.map((l: any) => <option key={l.id} value={l.id}>{l.name} — {l.phone}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm">
                {['CALL', 'MEETING', 'REMINDER', 'EMAIL'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled At</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                placeholder="Optional notes" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={createFollowUp.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 text-sm">
                {createFollowUp.isPending ? 'Saving...' : 'Schedule'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter by lead */}
      <div className="flex items-center gap-3">
        <select value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Leads</option>
          {leads.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <span className="text-sm text-gray-500">{filtered.length} follow-up{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Timeline grouped by lead */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">Loading...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">No follow-ups scheduled yet.</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([leadId, items]) => {
            const leadName = items[0]?.lead?.name ?? 'Unknown Lead';
            const isExpanded = expandedLeads.has(leadId);
            const pending = items.filter((i) => !i.isCompleted).length;

            return (
              <div key={leadId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Lead header */}
                <button onClick={() => toggleLead(leadId)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                      {leadName[0]}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{leadName}</p>
                      <p className="text-xs text-gray-500">{items.length} follow-up{items.length !== 1 ? 's' : ''}{pending > 0 ? ` · ${pending} pending` : ''}</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {/* Timeline */}
                {isExpanded && (
                  <div className="px-6 pb-4">
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-200" />
                      <ul className="space-y-4">
                        {items
                          .slice()
                          .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                          .map((f: any) => {
                            const Icon = TYPE_ICONS[f.type] ?? Bell;
                            return (
                              <li key={f.id} className="flex items-start gap-4 relative">
                                {/* Timeline dot */}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${f.isCompleted ? 'bg-green-100 border-green-400' : 'bg-white border-blue-400'}`}>
                                  <Icon className={`w-3.5 h-3.5 ${f.isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3">
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[f.type]}`}>{f.type}</span>
                                      <span className="text-xs text-gray-500">{new Date(f.scheduledAt).toLocaleString()}</span>
                                    </div>
                                    {!f.isCompleted ? (
                                      <button onClick={() => completeFollowUp.mutate(f.id)}
                                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium">
                                        <CheckCircle className="w-3.5 h-3.5" /> Mark done
                                      </button>
                                    ) : (
                                      <span className="text-xs text-green-600 font-medium">✓ Completed</span>
                                    )}
                                  </div>
                                  {f.notes && <p className="text-sm text-gray-600 mt-1">{f.notes}</p>}
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
