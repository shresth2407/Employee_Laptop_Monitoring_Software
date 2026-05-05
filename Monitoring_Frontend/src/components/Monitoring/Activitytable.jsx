import { Monitor, MousePointer2, Keyboard, ChevronLeft, ChevronRight, User } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

export default function ActivityTable({
  data = [],
  employeeMetaMap = new Map(),
  page,
  totalPages,
  setPage,
  formatDateTime,
}) {
  return (
    <div className="space-y-6">
      {/* PREMIUM TABLE CONTAINER */}
      <div className="relative rounded-[1.5rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        
        {/* Subtle Header Glow */}
        <div className="absolute inset-x-0 top-0 h-12 bg-slate-50/50 border-b border-slate-100/50" />

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px] relative z-10">
            {/* HEADER */}
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold">
                <th className="px-6 py-5 text-left">Employee Details</th>
                <th className="px-6 py-5 text-left">Current Activity</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-center">Input Signals</th>
                <th className="px-6 py-5 text-right">Last Heartbeat</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center opacity-40">
                      <Activity size={40} className="text-slate-300 mb-2" />
                      <p className="text-slate-500 font-medium text-base">No activity logs found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const emp = employeeMetaMap.get(item.employeeCode);

                  return (
                    <tr
                      key={item._id}
                      className="group hover:bg-slate-50/80 transition-all duration-300 cursor-default"
                    >
                      {/* EMPLOYEE COLUMN */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                             <User size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                              {item.employeeName}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md self-start mt-1">
                              {item.employeeCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* WORK ACTIVITY */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-[280px]">
                          <div className="flex items-center gap-2 mb-1">
                            <Monitor size={14} className="text-indigo-500" />
                            <span className="font-bold text-slate-700 truncate">
                              {item.applicationName || "System Idle"}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 truncate pl-5">
                            {item.windowTitle || "—"}
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                           <StatusBadge status={item.status} />
                        </div>
                      </td>

                      {/* SIGNALS (Premium Icons) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          {/* Keyboard Signal */}
                          <div className={`relative p-2 rounded-xl transition-all duration-500 ${item.keyboardActive ? 'bg-emerald-50 text-emerald-600 scale-110' : 'bg-slate-50 text-slate-300'}`}>
                            <Keyboard size={16} strokeWidth={item.keyboardActive ? 3 : 2} />
                            {item.keyboardActive && (
                              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            )}
                          </div>

                          {/* Mouse Signal */}
                          <div className={`relative p-2 rounded-xl transition-all duration-500 ${item.mouseActive ? 'bg-sky-50 text-sky-600 scale-110' : 'bg-slate-50 text-slate-300'}`}>
                            <MousePointer2 size={16} strokeWidth={item.mouseActive ? 3 : 2} />
                            {item.mouseActive && (
                              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* LAST ACTIVE */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-slate-600 italic">
                            {formatDateTime(item.lastHeartbeatAt).split(',')[1] || "—"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                             {formatDateTime(item.lastHeartbeatAt).split(',')[0]}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION (Modern Layout) */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Showing <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{totalPages}</span>
        </p>

        <div className="flex gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="group flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-all disabled:opacity-20 shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="group flex items-center justify-center px-6 h-10 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-indigo-600 transition-all disabled:opacity-20 shadow-lg shadow-slate-200"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}