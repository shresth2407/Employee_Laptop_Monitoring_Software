import { useEffect, useMemo, useState } from "react";
import { Activity, Monitor, Clock, User, Calendar, Filter } from "lucide-react";
import { useParams } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

import { getScreenshots } from "../../services/screenshotService";
import { getReports } from "../../services/reportService";
import { getMonitoringData } from "../../services/monitoringService";

const formatTime = (d) =>
  d ? new Date(d).toLocaleString("en-IN", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : "—";

export default function EmployeeDeepView() {
  const { id: employeeId } = useParams();

  const [screenshots, setScreenshots] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activities, setActivities] = useState([]); // 🔥 State for API monitoring data
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [filter, setFilter] = useState("all");

  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // Passing employeeId to filter monitoring data for this specific user
        const [s, r, m] = await Promise.all([
          getScreenshots({ employeeId }),
          getReports(),
          getMonitoringData({ employeeId }), 
        ]);

        const shots = s?.data || [];
        const reports = r?.data || [];
        const monitorData = m?.data || [];
        
        setScreenshots(shots);
        setActivities(monitorData);

        if (shots.length > 0) {
          const emp = shots[0]?.employeeId;
          setEmployeeInfo({
            name: emp?.name,
            code: emp?.employeeId,
            department: emp?.department?.name || "N/A",
            photo: emp?.profilePhoto?.url || "",
          });

          const empSessions = reports.filter(
            (x) => x.employeeCode === emp?.employeeId
          );
          setSessions(empSessions);
        }
      } catch (err) {
        console.error("Deep view error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [employeeId]);

  /* ================= DATE FILTER LOGIC ================= */
  const filteredData = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfYesterday = new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0);
    const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0);

    const filterFn = (item) => {
      // Logic handles both 'capturedAt' (screenshots) and 'lastHeartbeatAt' (monitoring)
      const dateKey = item.lastHeartbeatAt || item.capturedAt || item.date;
      const itemDate = new Date(dateKey).getTime();
      
      if (filter === "today") return itemDate >= startOfToday;
      if (filter === "yesterday") return itemDate >= startOfYesterday && itemDate < startOfToday;
      if (filter === "week") return itemDate >= lastWeek;
      return true;
    };

    return {
      shots: screenshots.filter(filterFn),
      sessions: sessions.filter(filterFn),
      activities: activities.filter(filterFn) // Filtered monitoring data
    };
  }, [filter, screenshots, sessions, activities]);

  if (loading) return <div className="p-10 text-center animate-pulse font-medium text-slate-500">Syncing employee data...</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* ================= HEADER & FILTERS ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Employee Insights"
          subtitle="Real-time activity and productivity tracking"
        />
        
        <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: 'week', label: 'Last 7 Days' },
            { id: 'all', label: 'All Time' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === btn.id 
                ? "bg-slate-900 text-white shadow-md" 
                : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= COMPACT PROFILE HEADER ================= */}
      {employeeInfo && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {employeeInfo.photo ? (
                  <img src={employeeInfo.photo} className="h-20 w-20 rounded-2xl object-cover border-2 border-white/10 shadow-2xl" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/10"><User size={32} /></div>
                )}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-slate-900"></span></span>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{employeeInfo.name}</h2>
                <div className="flex items-center gap-3 text-sm text-slate-400 mt-1 font-medium">
                  <span className="bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] border border-white/5">{employeeInfo.code}</span>
                  <span>{employeeInfo.department}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Screenshots', val: filteredData.shots.length, icon: '📸' },
                { label: 'Live Events', val: filteredData.activities.length, icon: '⚡' },
                { label: 'Sessions', val: filteredData.sessions.length, icon: '⏱' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center min-w-[100px]">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
                  <p className="text-xl font-black mt-1">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 🔥 ACTIVITY TIMELINE (Now using Monitoring Data) */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Activity size={18} /></div>
              <h3 className="font-bold text-slate-800 tracking-tight">Activity Timeline</h3>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-tighter">Monitoring Feed</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {filteredData.activities.length === 0 ? (
              <EmptyState title="No activity recorded" subtitle="Check if the monitoring agent is running." />
            ) : (
              filteredData.activities.map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    {/* Status based dot color */}
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                      item.status === 'ACTIVE' ? 'bg-emerald-500 shadow-emerald-200' : 
                      item.status === 'IDLE' ? 'bg-amber-500 shadow-amber-200' : 'bg-slate-400'
                    }`} />
                    <div className="w-[2px] flex-1 bg-slate-100 group-last:hidden" />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between bg-slate-50/50 group-hover:bg-indigo-50/50 p-4 rounded-2xl border border-slate-100 transition-all">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-slate-900 truncate uppercase tracking-tight">{item.applicationName}</p>
                           <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${
                             item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                           }`}>{item.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.windowTitle}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">Keystrokes: {item.keystrokes}</p>
                      </div>
                      <time className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-4">
                        {formatTime(item.lastHeartbeatAt)}
                      </time>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SCREENSHOTS GALLERY */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Monitor size={18} /></div>
            <h3 className="font-bold text-slate-800 tracking-tight">Visual Logs</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {filteredData.shots.length === 0 ? (
              <EmptyState title="No screenshots found" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredData.shots.map((item, i) => (
                  <div 
                    key={i} 
                    className="group relative rounded-2xl overflow-hidden cursor-zoom-in border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                    onClick={() => setSelectedImage(item.filePath)}
                  >
                    <img src={item.filePath} className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-[9px] text-white font-medium truncate">{formatTime(item.capturedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SESSIONS SECTION */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Clock size={18} /></div>
          <h3 className="font-bold text-slate-800 tracking-tight">Work Sessions</h3>
        </div>

        {filteredData.sessions.length === 0 ? (
          <EmptyState title="No session data" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.sessions.map((s, i) => (
              <div key={i} className="group relative rounded-[2rem] p-6 bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.date}</p>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">Daily Summary</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${s.status === "ENDED" ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-700 animate-pulse"}`}>
                    {s.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                  <div className="bg-white rounded-2xl py-3 border border-slate-100"><p className="text-[9px] font-bold text-slate-400">TOTAL</p><p className="text-sm font-bold text-slate-800">{s.totalWorkHours}</p></div>
                  <div className="bg-emerald-50 rounded-2xl py-3 border border-emerald-100"><p className="text-[9px] font-bold text-emerald-600">ACTIVE</p><p className="text-sm font-bold text-emerald-700">{s.activeHours}</p></div>
                  <div className="bg-rose-50 rounded-2xl py-3 border border-rose-100"><p className="text-[9px] font-bold text-rose-600">IDLE</p><p className="text-sm font-bold text-rose-700">{s.idleHours}</p></div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">PRODUCTIVITY</span>
                    <span className="text-indigo-600">{s.productivityScore}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: s.productivityScore }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL & CUSTOM STYLES */}
      {selectedImage && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-all" onClick={() => setSelectedImage("")}>
          <img src={selectedImage} className="max-h-full max-w-full rounded-2xl shadow-2xl animate-[zoomIn_0.2s_ease-out]" />
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}