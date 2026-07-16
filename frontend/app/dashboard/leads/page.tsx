'use client';
import { useState } from 'react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useUsers, Lead } from '@/lib/hooks';
import { Plus, Search, Download, MoreVertical, X, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUSES = ['NEW', 'QUALIFIED', 'CONTACTED', 'INTERESTED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'WON', 'LOST'];
const SOURCES = ['WEBSITE', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'WHATSAPP', 'AI_CALLING', 'MANUAL'];

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-gray-100 text-gray-700', QUALIFIED: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700', INTERESTED: 'bg-indigo-100 text-indigo-700',
  MEETING_SCHEDULED: 'bg-purple-100 text-purple-700', PROPOSAL_SENT: 'bg-orange-100 text-orange-700',
  WON: 'bg-green-100 text-green-700', LOST: 'bg-red-100 text-red-700',
};

const EMPTY_FORM = { name: '', phone: '', email: '', source: 'MANUAL', status: 'NEW', business: '', city: '', state: '', budget: '', leadScore: '0', remarks: '', assignedToId: '' };

const PLACEHOLDERS: Record<string, string> = {
  name: 'e.g. John Smith', phone: 'e.g. +91 98765 43210', email: 'e.g. john@example.com',
  business: 'e.g. TechCorp Pvt Ltd', city: 'e.g. Mumbai', state: 'e.g. Maharashtra',
  budget: 'e.g. 50000', leadScore: '0–100',
};

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

  const openCreate = () => { setEditLead(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };

  const handleSort = (col: string) => {
    if (sortBy === col) setOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setOrder('desc'); }
    setPage(1);
  };
  const SortIcon = ({ col }: { col: string }) => (
    <span className="ml-1 text-gray-400">{sortBy === col ? (order === 'asc' ? '↑' : '↓') : '↕'}</span>
  );
  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setForm({ name: lead.name, phone: lead.phone, email: lead.email ?? '', source: lead.source, status: lead.status, business: lead.business ?? '', city: lead.city ?? '', state: lead.state ?? '', budget: String(lead.budget ?? ''), leadScore: String(lead.leadScore), remarks: lead.remarks ?? '', assignedToId: lead.assignedToId ?? '' });
    setError(''); setShowModal(true); setMenuOpen(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const payload = { ...form, budget: form.budget ? parseFloat(form.budget) : undefined, leadScore: parseInt(form.leadScore) };
    try {
      if (editLead) await updateLead.mutateAsync({ id: editLead.id, data: payload });
      else await createLead.mutateAsync(payload);
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save lead.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await deleteLead.mutateAsync(id);
    setMenuOpen(null);
  };

  const handleExport = () => { window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leads/export/csv`, '_blank'); };

  const f = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, phone, email..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Sources</option>
          {SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
        {(search || statusFilter || sourceFilter) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); setPage(1); }}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {[
                  { label: 'Name / Email', col: 'name' },
                  { label: 'Phone', col: 'phone' },
                  { label: 'Source', col: 'source' },
                  { label: 'Status', col: 'status' },
                  { label: 'Score', col: 'leadScore' },
                  { label: 'Assigned To', col: null },
                  { label: 'Actions', col: null },
                ].map(({ label, col }) => (
                  <th key={label}
                    onClick={() => col && handleSort(col)}
                    className={`px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide ${col ? 'cursor-pointer hover:text-gray-700 select-none' : ''}`}>
                    {label}{col && <SortIcon col={col} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">Loading leads...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No leads found.</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900 text-sm">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{lead.phone}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">{lead.source}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[lead.status] ?? 'bg-gray-100 text-gray-700'}`}>{lead.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${lead.leadScore}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{lead.leadScore}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{lead.assignedTo?.name ?? '—'}</td>
                  <td className="px-5 py-4 relative">
                    <button onClick={() => setMenuOpen(menuOpen === lead.id ? null : lead.id)} className="text-gray-400 hover:text-gray-700">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {menuOpen === lead.id && (
                      <div className="absolute right-4 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32">
                        <button onClick={() => openEdit(lead)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit</button>
                        <button onClick={() => handleDelete(lead.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {leads.length} of {pagination.total} leads</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700">{page} / {pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{editLead ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {error && <p className="sm:col-span-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
              {[
                { key: 'name', label: 'Full Name', required: true },
                { key: 'phone', label: 'Phone', required: true },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'business', label: 'Business' },
                { key: 'city', label: 'City' },
                { key: 'state', label: 'State' },
                { key: 'budget', label: 'Budget', type: 'number' },
                { key: 'leadScore', label: 'Lead Score (0-100)', type: 'number' },
              ].map(({ key, label, type = 'text', required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => f(key, e.target.value)}
                    placeholder={PLACEHOLDERS[key] || ''}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                    required={required} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select value={form.source} onChange={(e) => f('source', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm text-gray-900 bg-white">
                  {SOURCES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => f('status', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm text-gray-900 bg-white">
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select value={form.assignedToId} onChange={(e) => f('assignedToId', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm text-gray-900 bg-white">
                  <option value="">— Select Assignee —</option>
                  {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea value={form.remarks} onChange={(e) => f('remarks', e.target.value)} rows={2}
                  placeholder="Optional notes about this lead..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm resize-none text-gray-900 placeholder:text-gray-400" />
              </div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={createLead.isPending || updateLead.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">
                  {createLead.isPending || updateLead.isPending ? 'Saving...' : editLead ? 'Update Lead' : 'Create Lead'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
