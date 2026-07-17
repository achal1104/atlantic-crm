'use client';
import { useState } from 'react';
import { useFollowUps, useCreateFollowUp, useCompleteFollowUp, useLeads } from '@/lib/hooks';
import { CheckCircle, Plus, Phone, Users, Bell, Mail, ChevronDown, ChevronUp, X, Calendar } from 'lucide-react';

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; icon: any }> = {
  CALL: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Phone },
  MEETING: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: Users },
  REMINDER: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Bell },
  EMAIL: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: Mail },
};

const inp = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition-all';
const lbl = 'block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest';

export default function FollowUpsPage() {
  const { data: allFollowUps = [], isLoading } = useFollowUps();
  const { data: leadsData } = useLeads({ limit: 100 });
  const leads = leadsData?.data ?? [];
  const createFollowUp = useCreateFollowUp();
  const completeFollowUp = useCompleteFollowUp();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ leadId: '', type: 'CALL', notes: '', scheduledAt: '' });
  const [error, setError] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.leadId) { setError('Please select a lead.'); return; }
    if (!form.scheduledAt) { setError('Please select a date and time.'); return; }
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

  const filtered = selectedLeadId ? allFollowUps.filter((f: any) => f.leadId === selectedLeadId) : allFollowUps;
  const grouped: Record<string, any[]> = {};
  for (const f of filtered) {
    if (!grouped[f.leadId]) grouped[f.leadId] = [];
    grouped[f.leadId].push(f);
  }
  const totalPending = allFollowUps.filter((f: any) => !f.isCompleted).length;

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Follow-ups</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {totalPending > 0
              ? <span className="text-amber-600 font-semibold">{totalPending} pending</span>
              : 'All caught up!'}
            {totalPending > 0 && ' follow-up' + (totalPending !== 1 ? 's' : '')}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Follow-up</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Schedule Follow-up</h2>
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-3 rounded-xl text-sm mb-4 border border-rose-100">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />{error}
            </div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Lead</label>
              <select value={form.leadId} onChange={e => setForm({ ...form, leadId: e.target.value })} className={inp} required>
                <option value="">Select a lead...</option>
                {leads.map((l: any) => <option key={l.id} value={l.id}>{l.name} — {l.phone}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inp}>
                <option>CALL</option>
                <option>MEETING</option>
                <option>REMINDER</option>
                <option>EMAIL</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Scheduled At</label>
              <input type="datetime-local" value={form.scheduledAt}
                onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                className={`${inp} [&::-webkit-calendar-picker-indicator]:opacity-50`} required />
            </div>
            <div>
              <label className={lbl}>Notes</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                className={inp} placeholder="Optional notes..." />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={createFollowUp.isPending} className="btn-primary">
                {createFollowUp.isPending
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                  : 'Schedule Follow-up'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-3">
        <select
          value={selectedLeadId}
          onChange={e => setSelectedLeadId(e.target.value)}
          className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 cursor-pointer shadow-sm">
          <option value="">All Leads</option>
          {leads.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <span className="text-sm text-slate-400 font-medium">{filtered.length} follow-up{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <div className="skeleton w-9 h-9 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3.5 w-1/3" />
                  <div className="skeleton h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-400">No follow-ups scheduled yet</p>
          <p className="text-xs text-slate-300 mt-1">Click "New Follow-up" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([leadId, items]) => {
            const leadName = items[0]?.lead?.name ?? 'Unknown Lead';
            const isExpanded = expandedLeads.has(leadId);
            const pending = items.filter((i) => !i.isCompleted).length;
            const completed = items.filter((i) => i.isCompleted).length;

            return (
              <div key={leadId} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button onClick={() => toggleLead(leadId)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-indigo-50/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-200">
                      {leadName[0]}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">{leadName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {pending > 0 && <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md font-bold">{pending} pending</span>}
                        {completed > 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-bold">{completed} done</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">{items.length} total</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-50">
                    <div className="relative mt-4">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100" />
                      <ul className="space-y-3">
                        {items.slice().sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                          .map((f: any) => {
                            const cfg = TYPE_CONFIG[f.type] ?? TYPE_CONFIG.REMINDER;
                            const Icon = cfg.icon;
                            const isPast = new Date(f.scheduledAt) < new Date() && !f.isCompleted;
                            return (
                              <li key={f.id} className="flex items-start gap-4 relative">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 z-10 border-2 ${
                                  f.isCompleted ? 'bg-emerald-50 border-emerald-200' : isPast ? 'bg-rose-50 border-rose-200' : `${cfg.bg} ${cfg.border}`
                                }`}>
                                  <Icon className={`w-3.5 h-3.5 ${f.isCompleted ? 'text-emerald-600' : isPast ? 'text-rose-500' : cfg.color}`} />
                                </div>
                                <div className={`flex-1 rounded-xl px-4 py-3 border ${
                                  f.isCompleted ? 'bg-slate-50 border-slate-100' : isPast ? 'bg-rose-50/50 border-rose-100' : 'bg-white border-slate-100 shadow-sm'
                                }`}>
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${cfg.bg} ${cfg.color} ${cfg.border}`}>{f.type}</span>
                                      <span className={`text-xs font-medium ${isPast && !f.isCompleted ? 'text-rose-500' : 'text-slate-400'}`}>
                                        {new Date(f.scheduledAt).toLocaleString()}
                                      </span>
                                      {isPast && !f.isCompleted && (
                                        <span className="text-[9px] bg-rose-100 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded-md font-bold">OVERDUE</span>
                                      )}
                                    </div>
                                    {!f.isCompleted ? (
                                      <button onClick={() => completeFollowUp.mutate(f.id)}
                                        className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-bold hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors">
                                        <CheckCircle className="w-3.5 h-3.5" /> Mark done
                                      </button>
                                    ) : (
                                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                                        <CheckCircle className="w-3.5 h-3.5" /> Completed
                                      </span>
                                    )}
                                  </div>
                                  {f.notes && <p className="text-xs text-slate-500 mt-1.5">{f.notes}</p>}
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
