'use client';
import { useState } from 'react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useUsers, Lead } from '@/lib/hooks';
import { Plus, Search, Download, MoreVertical, X, ChevronLeft, ChevronRight, Filter, ArrowUpDown } from 'lucide-react';

const STATUSES = ['NEW', 'QUALIFIED', 'CONTACTED', 'INTERESTED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'WON', 'LOST'];
const SOURCES = ['WEBSITE', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'WHATSAPP', 'AI_CALLING', 'MANUAL'];

const STATUS_STYLES: Record<string, string> = {
  NEW: 'bg-slate-100 text-slate-600 border border-slate-200',
  QUALIFIED: 'bg-blue-50 text-blue-700 border border-blue-200',
  CONTACTED: 'bg-amber-50 text-amber-700 border border-amber-200',
  INTERESTED: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  MEETING_SCHEDULED: 'bg-purple-50 text-purple-700 border border-purple-200',
  PROPOSAL_SENT: 'bg-orange-50 text-orange-700 border border-orange-200',
  WON: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  LOST: 'bg-rose-50 text-rose-700 border border-rose-200',
};

const SOURCE_STYLES: Record<string, string> = {
  WEBSITE: 'bg-blue-50 text-blue-600 border border-blue-100',
  FACEBOOK_ADS: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  GOOGLE_ADS: 'bg-amber-50 text-amber-600 border border-amber-100',
  WHATSAPP: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  AI_CALLING: 'bg-purple-50 text-purple-600 border border-purple-100',
  MANUAL: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const EMPTY_FORM = {
  name: '', phone: '', email: '', source: 'MANUAL', status: 'NEW',
  business: '', city: '', state: '', budget: '', leadScore: '0',
  remarks: '', assignedToId: '', nextFollowUp: '',
};

const inp = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition-all';
const lbl = 'block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest';

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<Record<string, string>>(EMPTY_FORM);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data, isLoading } = useLeads({ page, limit: 10, search, status: statusFilter, source: sourceFilter, sortBy, order });
  const { data: users = [] } = useUsers();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const leads: Lead[] = data?.data ?? [];
  const pagination = data?.pagination;
  const f = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const openCreate = () => {
    setEditLead(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setForm({
      name: lead.name,
      phone: lead.phone,
      email: lead.email ?? '',
      source: lead.source,
      status: lead.status,
      business: lead.business ?? '',
      city: lead.city ?? '',
      state: lead.state ?? '',
      budget: String(lead.budget ?? ''),
      leadScore: String(lead.leadScore),
      remarks: lead.remarks ?? '',
      assignedToId: lead.assignedToId ?? '',
      nextFollowUp: lead.nextFollowUp ? lead.nextFollowUp.slice(0, 16) : '',
    });
    setError('');
    setShowModal(true);
    setMenuOpen(null);
  };

  const handleSort = (col: string) => {
    if (sortBy === col) setOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setOrder('desc'); }
    setPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      budget: form.budget ? parseFloat(form.budget) : undefined,
      leadScore: parseInt(form.leadScore),
    };
    try {
      if (editLead) await updateLead.mutateAsync({ id: editLead.id, data: payload });
      else await createLead.mutateAsync(payload);
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save lead.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    await deleteLead.mutateAsync(id);
    setMenuOpen(null);
  };

  const handleExport = () =>
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leads/export/csv`, '_blank');

  const SortTh = ({ label, col }: { label: string; col?: string }) => (
    <th
      onClick={() => col && handleSort(col)}
      className={`px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80 ${col ? 'cursor-pointer hover:text-indigo-600 select-none' : ''}`}
    >
      <span className="flex items-center gap-1">
        {label}
        {col && <ArrowUpDown className={`w-3 h-3 ${sortBy === col ? 'text-indigo-500' : 'text-slate-300'}`} />}
      </span>
    </th>
  );

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {pagination ? `${pagination.total} total` : 'All leads'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold text-sm transition-colors bg-white shadow-sm"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, phone, email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none text-sm bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-700 cursor-pointer"
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <select
              value={sourceFilter}
              onChange={e => { setSourceFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-700 cursor-pointer"
            >
              <option value="">All Sources</option>
              {SOURCES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            {(search || statusFilter || sourceFilter) && (
              <button
                onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); setPage(1); }}
                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors border border-rose-100"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <SortTh label="Lead" col="name" />
                <SortTh label="Phone" />
                <SortTh label="Source" col="source" />
                <SortTh label="Status" col="status" />
                <SortTh label="Score" col="leadScore" />
                <SortTh label="Assigned To" />
                <SortTh label="Created" col="createdAt" />
                <SortTh label="" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-1">
                        <Search className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-sm font-semibold text-slate-400">No leads found</p>
                      <p className="text-xs text-slate-300">Try adjusting your filters or add a new lead</p>
                    </div>
                  </td>
                </tr>
              ) : leads.map(lead => (
                <tr key={lead.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm shadow-indigo-200">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                        <p className="text-xs text-slate-400">{lead.email || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">{lead.phone}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${SOURCE_STYLES[lead.source] ?? 'bg-slate-100 text-slate-600'}`}>
                      {lead.source.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${STATUS_STYLES[lead.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                          style={{ width: `${lead.leadScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{lead.leadScore}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {lead.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-[10px]">
                          {lead.assignedTo.name.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-600 font-medium">{lead.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === lead.id ? null : lead.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-slate-700 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpen === lead.id && (
                      <div className="absolute right-4 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-20 w-36 overflow-hidden">
                        <button
                          onClick={() => openEdit(lead)}
                          className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="block w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/40">
            <p className="text-xs text-slate-500">
              Showing{' '}
              <span className="font-bold text-slate-700">{(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total)}</span>
              {' '}of{' '}
              <span className="font-bold text-slate-700">{pagination.total}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-600 px-2">{page} / {pagination.pages}</span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editLead ? 'Edit Lead' : 'New Lead'}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{editLead ? 'Update lead details' : 'Fill in the details below'}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {error && (
                <div className="sm:col-span-2 flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-3 rounded-xl text-sm border border-rose-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />{error}
                </div>
              )}
              <div>
                <label className={lbl}>Full Name</label>
                <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="John Smith" className={inp} required />
              </div>
              <div>
                <label className={lbl}>Phone</label>
                <input value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+91 98765 43210" className={inp} required />
              </div>
              <div>
                <label className={lbl}>Email</label>
                <input type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="john@example.com" className={inp} />
              </div>
              <div>
                <label className={lbl}>Business</label>
                <input value={form.business} onChange={e => f('business', e.target.value)} placeholder="TechCorp Pvt Ltd" className={inp} />
              </div>
              <div>
                <label className={lbl}>City</label>
                <input value={form.city} onChange={e => f('city', e.target.value)} placeholder="Mumbai" className={inp} />
              </div>
              <div>
                <label className={lbl}>State</label>
                <input value={form.state} onChange={e => f('state', e.target.value)} placeholder="Maharashtra" className={inp} />
              </div>
              <div>
                <label className={lbl}>Budget (₹)</label>
                <input type="number" value={form.budget} onChange={e => f('budget', e.target.value)} placeholder="50000" className={inp} />
              </div>
              <div>
                <label className={lbl}>Lead Score (0–100)</label>
                <input type="number" value={form.leadScore} onChange={e => f('leadScore', e.target.value)} placeholder="0" className={inp} />
              </div>
              <div>
                <label className={lbl}>Source</label>
                <select value={form.source} onChange={e => f('source', e.target.value)} className={inp}>
                  {SOURCES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select value={form.status} onChange={e => f('status', e.target.value)} className={inp}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Next Follow-up</label>
                <input type="datetime-local" value={form.nextFollowUp} onChange={e => f('nextFollowUp', e.target.value)} className={inp} />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Assign To</label>
                <select value={form.assignedToId} onChange={e => f('assignedToId', e.target.value)} className={inp}>
                  <option value="">— Unassigned —</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role.replace(/_/g, ' ')})</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Remarks</label>
                <textarea
                  value={form.remarks}
                  onChange={e => f('remarks', e.target.value)}
                  rows={3}
                  placeholder="Any notes about this lead..."
                  className={`${inp} resize-none`}
                />
              </div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={createLead.isPending || updateLead.isPending} className="btn-primary">
                  {createLead.isPending || updateLead.isPending ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                  ) : editLead ? 'Update Lead' : 'Create Lead'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
