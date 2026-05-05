import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { ArrowUpRight, Activity, Clock, Zap, Target, RefreshCw, BarChart3 } from "lucide-react";
import ProductivityChart from "../../components/employee/ProductivityChart";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    todayWorkHours: "0.00h",
    activeTime: "0.00h",
    idleTime: "0.00h",
    productivity: 0,
    totalDaysWorked: 0,
    chartData: []
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatHours = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? "0.00h" : `${num.toFixed(2)}h`;
  };

  const fetchDashboard = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get("/employee/dashboard");
      const data = res.data;
      setDashboard({
        todayWorkHours: formatHours(data.todayWorkHours),
        activeTime: formatHours(data.activeTime),
        idleTime: formatHours(data.idleTime),
        productivity: data.productivity || 0,
        totalDaysWorked: data.totalDaysWorked || 0,
        chartData: data.chartData || []
      });
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Live System Status</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Performance <span className="text-emerald-500">Hub</span></h1>
        </div>
        <button onClick={fetchDashboard} disabled={isRefreshing} className="group p-3 bg-white border border-zinc-200 text-zinc-600 rounded-2xl hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm">
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
        </button>
      </header>

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Time" value={dashboard.activeTime} icon={<Clock size={18} />} color="text-blue-500" />
        <StatCard label="Work Hours" value={dashboard.todayWorkHours} icon={<Zap size={18} />} color="text-amber-500" />
        <StatCard label="Total Days" value={dashboard.totalDaysWorked} icon={<Target size={18} />} color="text-purple-500" />

        {/* Productivity Card */}
        <div className="bg-zinc-900 rounded-3xl p-5 text-white shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Efficiency</p>
            <Activity size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black mb-2">{dashboard.productivity}%</h2>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${dashboard.productivity}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: CHART + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REDUCED CHART SIZE */}
        <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <BarChart3 size={18} />
              </div>
              <h3 className="font-bold text-zinc-800">Productivity Trends</h3>
            </div>
            <select className="text-xs font-bold bg-zinc-50 border-none rounded-lg focus:ring-0 text-zinc-500">
              <option>Last 7 Days</option>
            </select>
          </div>

          {/* Height reduced from 400px to 280px */}
          <div className="h-[280px] w-full">
            <ProductivityChart data={dashboard.chartData} />
          </div>
        </div>

        {/* SIDEBAR: ADDITIONAL INFO */}
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 text-center">
            <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-widest mb-3">Daily Mindset</h4>
            <p className="text-[13px] text-emerald-800 font-medium italic leading-relaxed">
              "Focus on being productive instead of busy. Quality of work defines your progress."
            </p>
          </div>

          <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 shadow-sm">
            <h4 className="font-bold text-zinc-800 text-sm mb-4">Quick Insights</h4>
            <div className="space-y-4">
              <InsightItem label="Idle Time" value={dashboard.idleTime} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
    <div className={`w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4 ${color}`}>
      {icon}
    </div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
    <h3 className="text-xl font-black text-zinc-800 tracking-tight">{value}</h3>
  </div>
);

const InsightItem = ({ label, value, trend }) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="text-[10px] font-bold text-zinc-400 uppercase">{label}</p>
      <p className="text-sm font-bold text-zinc-800">{value}</p>
    </div>
    <span className="text-[10px] font-bold bg-zinc-100 px-2 py-1 rounded-md text-zinc-500">{trend}</span>
  </div>
);

export default Dashboard;