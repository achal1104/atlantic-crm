// frontend/app/dashboard/page.tsx

import { Users, TrendingUp, PhoneCall, DollarSign } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value="1,284" icon={Users} trend="+12% from last month" />
        <StatCard title="Today's Leads" value="45" icon={PhoneCall} trend="+5 new today" />
        <StatCard title="Converted Leads" value="892" icon={TrendingUp} trend="69% conversion rate" />
        <StatCard title="Revenue" value="$42,500" icon={DollarSign} trend="+8% increase" />
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-center text-gray-400">
          Analytics Chart Placeholder
        </div>
        <div className="h-64 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-center text-gray-400">
          Recent Activities Placeholder
        </div>
      </div>
    </div>
  );
}