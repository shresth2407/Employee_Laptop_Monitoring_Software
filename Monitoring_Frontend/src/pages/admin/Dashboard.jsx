import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Activity,
  Moon,
  WifiOff,
  RefreshCw,
  Target,
  Clock,
  Coffee,
  Zap,
  Monitor,
  AlertCircle
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import PageHeader from "../../components/ui/PageHeader";
import LoadingCard from "../../components/ui/LoadingCard";
import { getAdminSummary } from "../../services/dashboardService";

// =========================
// UI COMPONENTS
// =========================
function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.06] transition-transform duration-500 group-hover:scale-125`} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="mt-1.5 text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
          <p className="mt-1 text-xs font-medium text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl bg-gradient-to-br ${gradient} p-2.5 text-white shadow-sm`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

function MetricRow({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 transition-colors hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${colorClass}`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
        <p className="text-sm font-semibold text-slate-600">{title}</p>
      </div>
      <h3 className="text-sm font-bold text-slate-900">{value}</h3>
    </div>
  );
}

// =========================
// MAIN DASHBOARD
// =========================
export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [trend, setTrend] = useState([]);
  const [appUsage, setAppUsage] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async (manual = false) => {
    try {
      setError("");
      manual ? setRefreshing(true) : setLoading(true);

      const res = await getAdminSummary();

      if (!res?.success) {
        throw new Error(res?.message || "Failed to fetch dashboard data");
      }

      const data = res.data || {};

      setSummary(data);
      setTrend(data.trend || []);
      setAppUsage(data.appUsage || []);
    } catch (err) {
      setError(err?.message || "Dashboard synchronization failed.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Calculate dynamic max for App Usage bars
  const maxAppCount = useMemo(() => {
    if (!appUsage.length) return 1;
    return Math.max(...appUsage.map(app => app.count));
  }, [appUsage]);

  const pieData = useMemo(() => [
    { name: "Active", value: summary.activeSessions || 0, color: "#10b981" },
    { name: "Idle", value: summary.idleSessions || 0, color: "#f59e0b" },
    { name: "Offline", value: summary.offlineEmployees || 0, color: "#ef4444" },
  ], [summary]);

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Workforce analytics and productivity overview"
        rightContent={
          <button
            onClick={() => fetchSummary(true)}
            disabled={refreshing}
            className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : "transition-transform group-hover:rotate-180"} />
            {refreshing ? "Syncing..." : "Sync"}
          </button>
        }
      />

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingCard /><LoadingCard /><LoadingCard /><LoadingCard />
        </div>
      ) : (
        <div className="space-y-6">

          {/* =========================
              TOP CARDS
          ========================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Workforce" 
              value={summary.totalEmployees || 0} 
              subtitle="Registered Accounts" 
              icon={Users} 
              gradient="from-blue-500 to-indigo-600" 
            />
            <StatCard 
              title="Active Sessions" 
              value={summary.activeSessions || 0} 
              subtitle="Currently Working" 
              icon={Activity} 
              gradient="from-emerald-400 to-teal-500" 
            />
            <StatCard 
              title="Idle Sessions" 
              value={summary.idleSessions || 0} 
              subtitle="Inactive > 15m" 
              icon={Moon} 
              gradient="from-amber-400 to-orange-500" 
            />
            <StatCard 
              title="Offline" 
              value={summary.offlineEmployees || 0} 
              subtitle="Disconnected" 
              icon={WifiOff} 
              gradient="from-rose-400 to-red-500" 
            />
          </div>

          {/* =========================
              CHARTS GRID
          ========================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Line Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">Weekly Work Trend</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                    />
                    <Line type="monotone" dataKey="hours" name="Hours" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">Live Distribution</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={4} stroke="none">
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* =========================
              BOTTOM INSIGHTS
          ========================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* App Usage List */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                <Monitor size={16} className="text-slate-400" /> Top Applications
              </h3>
              
              <div className="space-y-3">
                {appUsage.length > 0 ? appUsage.map((app) => (
                  <div key={app._id} className="relative overflow-hidden rounded-lg bg-slate-50 p-3">
                    {/* Background Progress Bar */}
                    <div 
                      className="absolute left-0 top-0 h-full bg-indigo-50 transition-all duration-1000"
                      style={{ width: `${(app.count / maxAppCount) * 100}%` }}
                    />
                    <div className="relative z-10 flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700 truncate pr-4">{app._id}</span>
                      <span className="font-bold text-indigo-600">{app.count}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 py-4 text-center border border-dashed rounded-lg">No application data recorded today.</p>
                )}
              </div>
            </div>

            {/* Time & Productivity */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                <Target size={16} className="text-slate-400" /> Time & Productivity
              </h3>

              <div className="flex flex-col gap-3 flex-1 justify-center">
                <MetricRow 
                  title="Avg. Productivity" 
                  value={`${summary.avgProductivity || 0}%`} 
                  icon={Zap} 
                  colorClass="bg-blue-100 text-blue-600" 
                />
                <MetricRow 
                  title="Total Logged Hours" 
                  value={`${summary.totalWorkHours || "0.00"}h`} 
                  icon={Clock} 
                  colorClass="bg-slate-100 text-slate-600" 
                />
                <MetricRow 
                  title="Active Time" 
                  value={`${summary.activeHours || "0.00"}h`} 
                  icon={Activity} 
                  colorClass="bg-emerald-100 text-emerald-600" 
                />
                <MetricRow 
                  title="Idle Time" 
                  value={`${summary.idleHours || "0.00"}h`} 
                  icon={Coffee} 
                  colorClass="bg-amber-100 text-amber-600" 
                />
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}