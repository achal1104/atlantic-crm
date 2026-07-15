// frontend/app/dashboard/pipeline/page.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

// The exact stages required by the assessment
const STAGES = ["New", "Qualified", "Contacted", "Proposal Sent", "Won", "Lost"];

// Dummy data to visualize the board
const INITIAL_LEADS = [
  { id: 1, name: "Alice Johnson", company: "TechCorp", value: "$5,000", stage: "New" },
  { id: 2, name: "Bob Smith", company: "GlobalNet", value: "$12,000", stage: "Qualified" },
  { id: 3, name: "Charlie Davis", company: "CloudSys", value: "$8,500", stage: "Contacted" },
];

export default function PipelinePage() {
  const [leads, setLeads] = useState(INITIAL_LEADS);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Drag and drop leads to update their status.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" /> Add Deal
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {STAGES.map((stage) => (
            <div key={stage} className="w-80 flex flex-col bg-gray-50 rounded-xl border border-gray-200">
              {/* Column Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-100 rounded-t-xl">
                <h3 className="font-semibold text-gray-700">{stage}</h3>
                <span className="bg-white text-gray-600 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  {leads.filter((l) => l.stage === stage).length}
                </span>
              </div>

              {/* Column Body / Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[500px]">
                {leads
                  .filter((lead) => lead.stage === stage)
                  .map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:border-blue-400 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">{lead.company}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-green-600">{lead.value}</span>
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                          {lead.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}