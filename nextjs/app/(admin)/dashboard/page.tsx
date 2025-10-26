"use client";

import { useState, useEffect } from "react";

interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  successRate: number;
  totalProcessed: number;
}

interface DashboardData {
  overall: QueueStats;
  queues: {
    [key: string]: QueueStats & { name: string };
  };
  timestamp: string;
}

interface Job {
  id: string;
  name: string;
  progress: number | object;
  timestamp: number;
  failedReason?: string;
  attempts: number;
  data: any;
}

export default function QueueDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  console.log("data", data)

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/queue/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchActiveJobs = async () => {
    try {
      const response = await fetch("/api/queue/jobs?status=active&pageSize=20");
      if (response.ok) {
        const result = await response.json();
        setActiveJobs(result.jobs || []);
      }
    } catch (err) {
      console.error("Error fetching active jobs:", err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchActiveJobs()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();

    if (autoRefresh) {
      const interval = setInterval(fetchAllData, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const retryJob = async (jobId: string, queueName: string) => {
    try {
      const response = await fetch("/api/queue/jobs/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, queueName }),
      });

      if (response.ok) {
        fetchAllData(); // Refresh data
      }
    } catch (err) {
      console.error("Error retrying job:", err);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-semibold">Failed to load dashboard</h2>
          <button
            onClick={fetchAllData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overall, queues } = data;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Real-time queue monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                autoRefresh ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm text-slate-600">Auto-refresh</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="ml-2 text-sm bg-white border border-slate-300 rounded px-2 py-1 hover:bg-slate-50"
            >
              {autoRefresh ? "ON" : "OFF"}
            </button>
          </div>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshIcon />
            Refresh
          </button>
        </div>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Waiting"
          value={overall.waiting}
          icon={<ClockIcon />}
          trend="neutral"
        />
        <StatCard
          title="Active"
          value={overall.active}
          icon={<ActivityIcon />}
          trend="up"
        />
        <StatCard
          title="Completed"
          value={overall.completed}
          icon={<CheckCircleIcon />}
          trend="positive"
        />
        <StatCard
          title="Failed"
          value={overall.failed}
          icon={<XCircleIcon />}
          trend="negative"
        />
        <StatCard
          title="Delayed"
          value={overall.delayed}
          icon={<CalendarIcon />}
          trend="neutral"
        />
        <StatCard
          title="Success Rate"
          value={`${overall.successRate}%`}
          icon={<TrendingUpIcon />}
          trend="positive"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Queue Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Queue Details
            </h2>
            <div className="space-y-4">
              {Object.entries(queues).map(([queueName, stats]) => (
                <QueueCard
                  key={queueName}
                  name={queueName}
                  stats={stats}
                  onRetry={() => {
                    /* Handle bulk retry */
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Active Jobs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                Active Jobs
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {activeJobs.length}
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeJobs.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <ActivityIcon />
                  <p>No active jobs</p>
                </div>
              ) : (
                activeJobs.map((job: any) => (
                  <ActiveJobCard
                    key={job.id}
                    job={job}
                    onRetry={() => retryJob(job.id, job.queueName)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium">
                Clean Completed
              </button>
              <button className="p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium">
                Clean Failed
              </button>
              <button className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium">
                Pause All
              </button>
              <button className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-sm font-medium">
                Resume All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-8 text-center text-sm text-slate-500">
        Last updated: {new Date(data.timestamp).toLocaleString()}
        {autoRefresh && <span className="ml-2">• Auto-refresh every 3s</span>}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: "positive" | "negative" | "neutral" | "up";
}) {
  const trendColors = {
    positive: "text-green-600 bg-green-50 border-green-200",
    negative: "text-red-600 bg-red-50 border-red-200",
    neutral: "text-slate-600 bg-slate-50 border-slate-200",
    up: "text-blue-600 bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 ${trendColors[trend]} transition-all hover:scale-105`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-2xl font-bold">{value}</div>
        <div className="p-2 bg-white rounded-lg">{icon}</div>
      </div>
      <div className="text-sm font-medium opacity-75">{title}</div>
    </div>
  );
}

// Queue Card Component
function QueueCard({
  name,
  stats,
  onRetry,
}: {
  name: string;
  stats: any;
  onRetry: () => void;
}) {
  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-slate-800 capitalize">{name}</h3>
        <div className="flex gap-2">
          {stats.failed > 0 && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded hover:bg-orange-200"
            >
              Retry Failed ({stats.failed})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 text-sm mb-3">
        <QueueMetric label="Wait" value={stats.waiting} color="blue" />
        <QueueMetric label="Active" value={stats.active} color="yellow" />
        <QueueMetric label="Done" value={stats.completed} color="green" />
        <QueueMetric label="Failed" value={stats.failed} color="red" />
        <QueueMetric label="Delayed" value={stats.delayed} color="purple" />
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <div className="flex-1 bg-slate-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{
              width: `${
                stats.totalProcessed > 0
                  ? (stats.completed / stats.totalProcessed) * 100
                  : 0
              }%`,
            }}
          ></div>
        </div>
        <span>{stats.successRate}% success</span>
      </div>
    </div>
  );
}

function QueueMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses = {
    blue: "text-blue-700 bg-blue-50",
    green: "text-green-700 bg-green-50",
    red: "text-red-700 bg-red-50",
    yellow: "text-yellow-700 bg-yellow-50",
    purple: "text-purple-700 bg-purple-50",
  };

  return (
    <div
      className={`text-center p-2 rounded ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <div className="font-bold">{value}</div>
      <div className="text-xs opacity-75">{label}</div>
    </div>
  );
}

// Active Job Card with Progress
function ActiveJobCard({ job, onRetry }: { job: Job; onRetry: () => void }) {
  const progress = typeof job.progress === "number" ? job.progress : 0;

  return (
    <div className="p-3 border border-slate-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-sm text-slate-800 truncate">
          {job.name}
        </div>
        <div className="text-xs text-slate-500">
          {job.timestamp ? new Date(job.timestamp).toLocaleTimeString() : "N/A"}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-linear-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="text-slate-500">Attempts: {job.attempts}</div>
        {job.failedReason && (
          <button
            onClick={onRetry}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// Icons
function RefreshIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function XCircleIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
function TrendingUpIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
}
