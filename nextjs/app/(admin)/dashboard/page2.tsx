"use client"

import { useState } from 'react';
import { AutomationMetrics } from "../../../components/dashboard/AutomationMetrics.js";
import MonthlyAutomationChart from "../../../components/dashboard/MonthlyAutomationChart.js";

export default function Ecommerce() {
  const [activeTab, setActiveTab] = useState('metrics');

  return (
    <div className="space-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'metrics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Automation Metrics
          </button>
          <button
            onClick={() => setActiveTab('queues')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'queues'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Queue Dashboard
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-7">
              <AutomationMetrics />
              <MonthlyAutomationChart />
            </div>
          </div>
        )}

        {activeTab === 'queues' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <iframe
              src="http://localhost:3001/admin/queues"
              style={{ width: "100%", height: "80vh", border: "none" }}
              className="rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}