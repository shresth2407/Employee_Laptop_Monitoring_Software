import { useEffect, useState, useMemo } from "react";
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  User,
  Monitor,
  Maximize2,
  X,
  Clock,
  MousePointer2,
  Keyboard,
  AppWindow
} from "lucide-react";

import { getManagerReports } from "../../services/reportService";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  
  // State to track which user is being filtered
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await getManagerReports();
        setReports(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Reports fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  /* ================= DATA PROCESSING ================= */
  const processedData = useMemo(() => {
    // Apply User Filter if selected
    const targetReports = selectedEmployeeId 
      ? reports.filter(r => r.employee?._id === selectedEmployeeId)
      : reports;

    if (!targetReports.length) {
      return {
        tableData: [],
        topApps: [],
        allScreenshots: [],
        activityLogs: [],
        filteredName: selectedEmployeeId ? "Unknown User" : null
      };
    }

    const appMap = {};
    const allScreenshotsList = [];
    const tableData = [];
    const activityLogsList = [];
    let filteredName = null;

    targetReports.forEach((reportData) => {
      const emp = reportData.employee || {};
      if (selectedEmployeeId && !filteredName) filteredName = emp.name;

      // 1. Process Sessions for Table
      (reportData.sessions || []).forEach((session) => {
        const pStr = session.productivityScore || "0%";
        const idle = parseFloat(session.idleHours || "0");
        const work = parseFloat(session.totalWorkHours || "0");
        const active = parseFloat(session.activeHours || "0");

        const dateObj = new Date(session.date || new Date());

        tableData.push({
          id: session._id,
          employeeId: emp._id,
          employeeName: emp.name || "Unknown",
          employeeCode: emp.employeeId || "—",
          avatar: emp.profilePhotoUrl || emp.profilePhoto?.url,
          date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          totalWork: `${work.toFixed(2)}h`,
          active: `${active.toFixed(2)}h`,
          idle: `${idle.toFixed(2)}h`,
          productivity: pStr,
          status: session.status || "—"
        });
      });

      // 2. Process Activities (Top Apps & Detailed Logs)
      (reportData.activities || []).forEach((act) => {
        const appName = act.applicationName || "Unknown";
        appMap[appName] = (appMap[appName] || 0) + 1;

        // Push detailed activity log
        if (act.lastHeartbeatAt) {
          activityLogsList.push({
            id: act._id,
            employeeId: act.employeeId || emp._id,
            employeeName: act.employeeName || emp.name || "Unknown",
            employeeCode: act.employeeCode || emp.employeeId || "—",
            avatar: act.profilePhoto || emp.profilePhotoUrl || emp.profilePhoto?.url,
            appName: appName,
            windowTitle: act.windowTitle || "—",
            keyboardActive: act.keyboardActive,
            mouseActive: act.mouseActive,
            status: act.status || "—",
            lastActive: new Date(act.lastHeartbeatAt)
          });
        }
      });

      // 3. Process All Screenshots
      (reportData.screenshots || []).forEach((shot) => {
        if (shot.filePath) {
          allScreenshotsList.push({
            id: shot._id,
            url: shot.filePath,
            capturedAt: new Date(shot.capturedAt),
            empName: emp.name || "Unknown",
            app: reportData.activities?.find(a => a.capturedAt === shot.capturedAt)?.applicationName || "Screen"
          });
        }
      });
    });

    // Sort Apps
    const topApps = Object.entries(appMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); 

    // Sort ALL Screenshots newest first
    const allScreenshots = allScreenshotsList.sort((a, b) => b.capturedAt - a.capturedAt);
    
    // Sort Activity Logs newest first
    const activityLogs = activityLogsList.sort((a, b) => b.lastActive - a.lastActive);

    tableData.reverse();

    return {
      tableData,
      topApps,
      allScreenshots,
      activityLogs,
      filteredName
    };
  }, [reports, selectedEmployeeId]);

  const maxAppCount = processedData.topApps.length > 0 ? processedData.topApps[0].count : 1;

  /* ================= FORMAT TIME HELPER ================= */
  const formatTime = (dateObj) => {
    return dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse pb-10">
        <div className="lg:col-span-1 h-[500px] bg-slate-200 rounded-2xl w-full"></div>
        <div className="lg:col-span-2 h-[500px] bg-slate-200 rounded-2xl w-full"></div>
        <div className="lg:col-span-3 h-64 bg-slate-200 rounded-2xl w-full"></div>
      </div>
    );
  }

  /* ================= UI RENDER ================= */
  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
    {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <BarChart3 size={14} /> Analytics Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Workforce Reports</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Data Badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
            <Calendar size={16} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Live Data</span>
          </div>
        </div>
      </header>

      {/* COMPACT DASHBOARD WIDGETS (Apps & Screenshots) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TOP APPLICATIONS */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
            <AppWindow size={16} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Top Applications</h3>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {processedData.topApps.length > 0 ? processedData.topApps.map((app, i) => (
              <div key={i} className="relative overflow-hidden rounded-md bg-slate-50 p-2.5 border border-slate-100">
                <div 
                  className="absolute left-0 top-0 h-full bg-indigo-50 transition-all duration-1000"
                  style={{ width: `${(app.count / maxAppCount) * 100}%` }}
                />
                <div className="relative z-10 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 truncate pr-4">{app.name}</span>
                  <span className="font-bold text-indigo-600">{app.count} hits</span>
                </div>
              </div>
            )) : (
              <div className="text-center text-xs text-slate-400 py-8 border border-dashed rounded-lg">No app data.</div>
            )}
          </div>
        </div>

        {/* ALL RECENT SCREENSHOTS (3x3 Grid, Scrollable) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3 shrink-0">
            <div className="flex items-center gap-2">
              <Monitor size={16} className="text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Captures</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {processedData.allScreenshots.length} Total Captures
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-2 auto-rows-max">
            {processedData.allScreenshots.length > 0 ? processedData.allScreenshots.map((shot) => (
              <div key={shot.id} className="group relative overflow-hidden rounded-lg border border-slate-200 shadow-sm aspect-video bg-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedImage(shot.url)}
                  className="block h-full w-full overflow-hidden cursor-pointer"
                >
                  <img 
                    src={shot.url} 
                    alt="Screenshot" 
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/40 flex items-center justify-center">
                    <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                  </div>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent p-2 pt-6 pointer-events-none transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                  <p className="text-[10px] font-bold text-white truncate leading-tight">{shot.empName}</p>
                  <p className="text-[9px] font-medium text-slate-300 flex items-center gap-1 mt-0.5 leading-none">
                    <Clock size={9} /> {shot.capturedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center text-xs text-slate-400 py-12 border border-dashed rounded-lg flex items-center justify-center">
                No captures available.
              </div>
            )}
          </div>
        </div>
      </div>

 {/* NEW: DETAILED ACTIVITY STREAM TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">Live Activity Stream</h3>
            {selectedEmployeeId && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider animate-in zoom-in duration-300">
                User: {processedData.filteredName}
                <button onClick={() => setSelectedEmployeeId(null)} className="hover:text-indigo-900 hover:bg-indigo-200 rounded-full p-0.5 transition-colors">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">{processedData.activityLogs.length} Events</span>
        </div>

        <div className="w-full overflow-x-auto max-h-[400px] custom-scrollbar">
          <table className="w-full text-sm min-w-[950px]">
            <thead className="bg-white text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Employee</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Application</th>
                <th className="px-6 py-4 font-semibold">Window Title</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Input Activity</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Last Heartbeat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.activityLogs.length > 0 ? processedData.activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                  
                  {/* Clickable Employee Cell */}
                  <td 
                    className="px-6 py-3 whitespace-nowrap cursor-pointer"
                    onClick={() => setSelectedEmployeeId(log.employeeId)}
                    title="Click to view only this user's data"
                  >
                    <div className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-lg transition-colors group-hover:bg-indigo-50">
                      <div className="h-8 w-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        {log.avatar ? <img src={log.avatar} alt="Profile" className="h-full w-full object-cover" /> : <User size={14} className="text-slate-400" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{log.employeeName}</div>
                        <div className="text-[11px] font-medium text-slate-500">{log.employeeCode}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                      <AppWindow size={12} className="text-slate-400" />
                      {log.appName}
                    </span>
                  </td>

                  <td className="px-6 py-3">
                    <div className="max-w-xs md:max-w-md truncate text-slate-600 font-medium" title={log.windowTitle}>
                      {log.windowTitle}
                    </div>
                  </td>

                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase ${log.mouseActive ? 'text-emerald-600' : 'text-slate-300'}`} title="Mouse Active">
                        <MousePointer2 size={16} className={log.mouseActive ? 'fill-emerald-100' : ''} />
                      </div>
                      <div className={`flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase ${log.keyboardActive ? 'text-emerald-600' : 'text-slate-300'}`} title="Keyboard Active">
                        <Keyboard size={16} />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3 whitespace-nowrap">
                    {log.status === "ACTIVE" ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider border border-emerald-200">Active</span>
                    ) : log.status === "IDLE" ? (
                       <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider border border-amber-200">Idle</span>
                    ) : (
                       <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider border border-slate-200">Offline</span>
                    )}
                  </td>

                  <td className="px-6 py-3 whitespace-nowrap text-slate-500 font-medium">
                    <div className="flex flex-col">
                      <span>{log.lastActive.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span className="text-xs">{formatTime(log.lastActive)}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No activity events recorded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SESSIONS DATA TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">Session Summaries</h3>
            {selectedEmployeeId && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider animate-in zoom-in duration-300">
                User: {processedData.filteredName}
                <button onClick={() => setSelectedEmployeeId(null)} className="hover:text-indigo-900 hover:bg-indigo-200 rounded-full p-0.5 transition-colors">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">{processedData.tableData.length} Records</span>
        </div>

        <div className="w-full overflow-x-auto max-h-[400px] custom-scrollbar">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Employee</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Date</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Total Work</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Active</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Idle</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Productivity</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.tableData.length > 0 ? processedData.tableData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  <td 
                    className="px-6 py-3.5 whitespace-nowrap cursor-pointer"
                    onClick={() => setSelectedEmployeeId(row.employeeId)}
                    title="Click to view only this user's data"
                  >
                    <div className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-lg transition-colors group-hover:bg-indigo-50">
                      <div className="h-8 w-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        {row.avatar ? <img src={row.avatar} alt="Profile" className="h-full w-full object-cover" /> : <User size={14} className="text-slate-400" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{row.employeeName}</div>
                        <div className="text-[11px] font-medium text-slate-500">{row.employeeCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 font-medium">{row.date}</td>
                  <td className="px-6 py-3.5 text-slate-600">{row.totalWork}</td>
                  <td className="px-6 py-3.5 text-emerald-600 font-medium">{row.active}</td>
                  <td className="px-6 py-3.5 text-amber-600 font-medium">{row.idle}</td>
                  <td className="px-6 py-3.5 font-bold text-indigo-600">{row.productivity}</td>
                  <td className="px-6 py-3.5">
                    {row.status === "ACTIVE" ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider border border-emerald-200">Active</span>
                    ) : row.status === "IDLE" ? (
                       <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider border border-amber-200">Idle</span>
                    ) : (
                       <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider border border-slate-200">Ended</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No session logs available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

     

      {/* SCREENSHOT MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm transition-opacity">
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <button onClick={() => setSelectedImage("")} className="absolute -top-4 -right-4 lg:-right-12 lg:top-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors backdrop-blur-md">
              <X size={24} />
            </button>
            <img src={selectedImage} alt="Screenshot preview full" className="max-h-[90vh] rounded-xl object-contain shadow-2xl ring-1 ring-white/10" />
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles for the containers */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}} />

    </div>
  );
};

export default Reports;