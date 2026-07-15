export const generateCSV = (leads: any[]): string => {
  const headers = ['Name', 'Phone', 'Email', 'Source', 'Status', 'Business', 'City', 'State', 'Budget', 'Lead Score', 'Assigned To', 'Created At'];
  const rows = leads.map((l) => [
    l.name, l.phone, l.email ?? '',
    l.source, l.status, l.business ?? '',
    l.city ?? '', l.state ?? '',
    l.budget ?? '', l.leadScore,
    l.assignedTo?.name ?? '',
    new Date(l.createdAt).toLocaleDateString(),
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));

  return [headers.join(','), ...rows].join('\n');
};
