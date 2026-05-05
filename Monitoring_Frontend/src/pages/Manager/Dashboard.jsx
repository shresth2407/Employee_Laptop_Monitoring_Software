import { useEffect, useState } from "react";
import api from "../../services/api";

import ManagerStatCard from "../../components/Manager/ManagerStatCard";
import TeamTable from "../../components/Manager/TeamTable";

import { LayoutDashboard, Loader2, AppWindow } from "lucide-react";

const ManagerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchTeam();
  }, []);

  // ================= FETCH DASHBOARD =================
  const fetchDashboard = async () => {
    try {
      const res = await api.get("/manager/dashboard");
      const data = res.data?.data || res.data;
      setDashboard(data);
    } catch (err) {
      console.error("❌ Dashboard error:", err);
    }
  };

  // ================= FETCH TEAM =================
  const fetchTeam = async () => {
    try {
      const res = await api.get("/manager/team");
      setTeam(res.data?.data || res.data || []);
    } catch (err) {
      console.error("❌ Team error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboard) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="text-emerald-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Loading command center...
        </p>
      </div>
    );
  }

  // ================= SAFE DATA =================
  const totalPersonnel = dashboard.totalTeam || 0;
  const activeCount = dashboard.active || 0;
  const idleCount = dashboard.idle || 0;

  const totalActivities = dashboard.totalActivities || 0;
  const totalScreenshots = dashboard.totalScreenshots || 0;

  const activePercentage = totalPersonnel
    ? ((activeCount / totalPersonnel) * 100).toFixed(0)
    : 0;

  const idlePercentage = totalPersonnel
    ? ((idleCount / totalPersonnel) * 100).toFixed(0)
    : 0;

  // Calculate max app usage for the visual progress bars
  const appUsageData = dashboard.appUsage || [];
  const maxAppCount = appUsageData.length > 0 
    ? Math.max(...appUsageData.map(a => a.count)) 
    : 1;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ================= HEADER ================= */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <LayoutDashboard size={14} /> Global Fleet Monitor
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Command Center
          </h1>
        </div>
      </header>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ManagerStatCard
          title="Total Personnel"
          value={totalPersonnel}
          type="default"
        />
        <ManagerStatCard
          title="Active Nodes"
          value={activeCount}
          type="performance"
          trend={`${activePercentage}% Online`}
        />
        <ManagerStatCard
          title="Idle Nodes"
          value={idleCount}
          type="urgency"
          trend={`${idlePercentage}% Idle`}
        />
        <ManagerStatCard
          title="Activities"
          value={totalActivities}
          type="default"
        />
        <ManagerStatCard
          title="Screenshots"
          value={totalScreenshots}
          type="default"
        />
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Side: Table */}
        <div className="lg:col-span-8 flex flex-col">
          <TeamTable team={team} />
        </div>

        {/* Right Side: Widgets */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Top Applications Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <AppWindow size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Top Applications
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Most active software hits
                </p>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
              {appUsageData.length > 0 ? (
                appUsageData.map((app, i) => (
                  <div key={i} className="relative overflow-hidden rounded-lg bg-slate-50 p-3 border border-slate-100 group">
                    {/* Animated Background Bar */}
                    <div 
                      className="absolute left-0 top-0 h-full bg-emerald-50 transition-all duration-1000 group-hover:bg-emerald-100"
                      style={{ width: `${(app.count / maxAppCount) * 100}%` }}
                    />
                    
                    {/* Foreground Content */}
                    <div className="relative z-10 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 truncate pr-4">
                        {app.application}
                      </span>
                      <span className="font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-emerald-100 shadow-sm">
                        {app.count}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-slate-500">No application data recorded yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ManagerDashboard;