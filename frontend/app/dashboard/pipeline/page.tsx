'use client';
import { useLeads, useUpdateLead } from '@/lib/hooks';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { DollarSign, GripVertical } from 'lucide-react';

const STAGES = ['NEW', 'QUALIFIED', 'CONTACTED', 'INTERESTED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'WON', 'LOST'];

const STAGE_CONFIG: Record<string, { gradient: string; glow: string }> = {
  NEW: { gradient: 'from-slate-500 to-slate-600', glow: '' },
  QUALIFIED: { gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/20' },
  CONTACTED: { gradient: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20' },
  INTERESTED: { gradient: 'from-indigo-500 to-violet-600', glow: 'shadow-indigo-500/20' },
  MEETING_SCHEDULED: { gradient: 'from-purple-500 to-fuchsia-600', glow: 'shadow-purple-500/20' },
  PROPOSAL_SENT: { gradient: 'from-orange-500 to-red-500', glow: 'shadow-orange-500/20' },
  WON: { gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/20' },
  LOST: { gradient: 'from-rose-500 to-red-600', glow: 'shadow-rose-500/20' },
};

export default function PipelinePage() {
  const { data, isLoading } = useLeads({ limit: 200 });
  const updateLead = useUpdateLead();
  const leads = data?.data ?? [];

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    const lead = leads.find((l: any) => l.id === draggableId);
    if (!lead || lead.status === newStatus) return;
    await updateLead.mutateAsync({ id: draggableId, data: { status: newStatus } });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading pipeline...</p>
      </div>
    </div>
  );

  const totalLeads = leads.length;
  const wonLeads = leads.filter((l: any) => l.status === 'WON').length;

  return (
    <div className="space-y-4 h-full flex flex-col animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Pipeline</h1>
          <p className="text-sm text-slate-500 mt-0.5">Drag and drop leads across stages.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-center">
            <p className="text-lg font-bold text-slate-900">{totalLeads}</p>
            <p className="text-[10px] text-slate-400 font-medium">Total</p>
          </div>
          <div className="rounded-xl px-3 py-2 shadow-sm text-center" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            <p className="text-lg font-bold text-white">{wonLeads}</p>
            <p className="text-[10px] text-emerald-100 font-medium">Won</p>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1 -mx-1 px-1">
          {STAGES.map((stage) => {
            const cfg = STAGE_CONFIG[stage];
            const stageLeads = leads.filter((l: any) => l.status === stage);
            const totalBudget = stageLeads.reduce((s: number, l: any) => s + (l.budget || 0), 0);

            return (
              <div key={stage} className="w-60 shrink-0 flex flex-col rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <div className={`bg-gradient-to-r ${cfg.gradient} p-3 shadow-md ${cfg.glow}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-bold uppercase tracking-wide">
                      {stage.replace(/_/g, ' ')}
                    </span>
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                      {stageLeads.length}
                    </span>
                  </div>
                  {totalBudget > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <DollarSign className="w-3 h-3 text-white/60" />
                      <span className="text-white/70 text-[10px] font-medium">{totalBudget.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                      className={`flex-1 p-2 space-y-2 min-h-[280px] transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/60' : 'bg-slate-50/80'}`}>
                      {stageLeads.map((lead: any, index: number) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps}
                              className={`bg-white rounded-xl border p-3 transition-all ${
                                snapshot.isDragging
                                  ? 'shadow-2xl border-indigo-300 rotate-1 scale-[1.03]'
                                  : 'border-slate-100 hover:border-indigo-200 hover:shadow-md shadow-sm'
                              }`}>
                              <div className="flex items-start gap-2 mb-2">
                                <div {...provided.dragHandleProps} className="mt-0.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                                  <GripVertical className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-slate-900 text-xs leading-tight truncate">{lead.name}</h4>
                                  {lead.business && <p className="text-[10px] text-slate-400 truncate mt-0.5">{lead.business}</p>}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-1 mb-2">
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-semibold uppercase tracking-wide">
                                  {lead.source.replace(/_/g, ' ')}
                                </span>
                                {lead.budget ? (
                                  <span className="text-[11px] font-bold text-emerald-600">${lead.budget.toLocaleString()}</span>
                                ) : null}
                              </div>

                              {lead.leadScore > 0 && (
                                <div className="flex items-center gap-1.5 mb-2">
                                  <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-1 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all"
                                      style={{ width: `${lead.leadScore}%` }} />
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-medium">{lead.leadScore}</span>
                                </div>
                              )}

                              {lead.assignedTo && (
                                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50">
                                  <div className="w-4 h-4 rounded-md bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[8px] font-bold text-white">
                                    {lead.assignedTo.name.charAt(0)}
                                  </div>
                                  <span className="text-[10px] text-slate-400 truncate">{lead.assignedTo.name}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {stageLeads.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-14 border-2 border-dashed border-slate-200 rounded-xl">
                          <p className="text-[10px] text-slate-300 font-medium">Drop here</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
