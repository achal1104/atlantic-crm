'use client';
import { useLeads, useUpdateLead } from '@/lib/hooks';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MoreHorizontal } from 'lucide-react';

const STAGES = ['NEW', 'QUALIFIED', 'CONTACTED', 'INTERESTED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'WON', 'LOST'];

const STAGE_COLORS: Record<string, string> = {
  NEW: 'border-t-gray-400', QUALIFIED: 'border-t-blue-500', CONTACTED: 'border-t-yellow-500',
  INTERESTED: 'border-t-indigo-500', MEETING_SCHEDULED: 'border-t-purple-500',
  PROPOSAL_SENT: 'border-t-orange-500', WON: 'border-t-green-500', LOST: 'border-t-red-500',
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

  if (isLoading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading pipeline...</div>;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">Drag and drop leads to update their status.</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l: any) => l.status === stage);
            return (
              <div key={stage} className={`w-72 shrink-0 flex flex-col bg-gray-50 rounded-xl border-t-4 border border-gray-200 ${STAGE_COLORS[stage]}`}>
                <div className="p-3 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 text-sm">{stage.replace(/_/g, ' ')}</h3>
                  <span className="bg-white text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-gray-200">
                    {stageLeads.length}
                  </span>
                </div>
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                      className={`flex-1 p-2 space-y-2 min-h-[400px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}>
                      {stageLeads.map((lead: any, index: number) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                              className={`bg-white p-3 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing transition-shadow ${snapshot.isDragging ? 'shadow-lg border-blue-400' : 'hover:border-blue-300 hover:shadow-sm'}`}>
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">{lead.name}</h4>
                                <MoreHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
                              </div>
                              {lead.business && <p className="text-xs text-gray-500 mb-2">{lead.business}</p>}
                              <div className="flex justify-between items-center">
                                {lead.budget ? (
                                  <span className="text-xs font-bold text-green-600">${lead.budget.toLocaleString()}</span>
                                ) : <span />}
                                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{lead.source}</span>
                              </div>
                              {lead.assignedTo && (
                                <div className="mt-2 flex items-center gap-1">
                                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                                    {lead.assignedTo.name.charAt(0)}
                                  </div>
                                  <span className="text-xs text-gray-500">{lead.assignedTo.name}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
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
