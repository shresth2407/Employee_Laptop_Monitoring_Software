import { useEffect, useState } from "react";
import ProductivityChart from "../../components/employee/ProductivityChart";
import api from "../../services/api";
import { BarChart3, Calendar, Clock, Target, Zap, ChevronDown } from "lucide-react";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalHours: "0.00h",
    totalDays: 0,
    sessions: 0,
    productivity: 0,
    chartData: []
  });
  const [timeframe, setTimeframe] = useState("7d");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/employee/dashboard?range=${timeframe}`);
      const d = res.data || {};
      
      setStats({
        totalHours: `${Number(d.totalWorkHours || 0).toFixed(2)}h`,
        totalDays: d.totalDaysWorked || 0,
        sessions: d.totalSessions || 0,
        productivity: d.productivity || 0,
        chartData: d.chartData || []
      });
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  return (
    <div className="w-full pb-10 space-y-6">
      {/* ================= HEADER ================= */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Statistics</h1>
          <p className="text-sm text-slate-500 mt-1">Analyze your working patterns and efficiency</p>
        </div>

        <div className="relative w-full sm:w-auto">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">Lifetime</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </header>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Hours", value: stats.totalHours, icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Active Days", value: stats.totalDays, icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Total Sessions", value: stats.sessions, icon: Target, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Efficiency", value: `${stats.productivity}%`, icon: Zap, highlight: true }
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className={`relative overflow-hidden rounded-xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
              stat.highlight 
                ? 'border-indigo-600 bg-indigo-600 text-white' 
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${stat.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {stat.label}
                </p>
                <h3 className={`mt-1.5 text-3xl font-bold tracking-tight ${stat.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </h3>
              </div>
              <div className={`rounded-lg p-2.5 ${stat.highlight ? 'bg-white/20 text-white' : `${stat.bg} ${stat.color}`}`}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= CHART ================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <BarChart3 size={18} strokeWidth={2.5} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Performance Velocity</h3>
        </div>
        
        {/* Wrapper relies on the inner chart's height now */}
        <div className={`w-full transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
          <ProductivityChart data={stats.chartData} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;