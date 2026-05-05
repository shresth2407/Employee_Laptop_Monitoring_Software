import { Users, Activity, Moon, WifiOff, TrendingUp } from "lucide-react";

function Card({ title, value, subtitle, icon: Icon, color, percentage }) {
  return (
    <div
  className="group relative bg-white border border-slate-100 rounded-[2rem] p-4 
             shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 
             hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 overflow-hidden"
>
      {/* Subtle Background Pattern */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] ${color.text.replace('text', 'bg')} blur-2xl`} />

      <div className="flex flex-col h-full space-y-3">
        <div className="flex items-start justify-between">
          {/* Icon Wrapper */}
          <div className={`p-2 rounded-2xl ${color.bg} ${color.text} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} strokeWidth={2.5} />
          </div>

          {/* Live Indicator for Active Status */}
          {title === "Active" && (
            <span className="flex h-2 w-2 mt-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-0.5">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {value ?? 0}
            </h3>
            {percentage > 0 && (
              <span className={`text-xs font-bold ${color.text} flex items-center`}>
                 {percentage}%
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Mini Progress Bar for Visual Context */}
        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden mt-auto">
          <div 
            className={`h-full ${color.text.replace('text', 'bg')} transition-all duration-1000 ease-out opacity-70`}
            style={{ width: `${percentage || 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function KpiCards({
  kpis = {},
  activeRate = 0,
  idleRate = 0,
}) {
  // Calculate offline rate for the progress bar
  const offlineRate = kpis.totalEmployees ? Math.round((kpis.offlineEmployees / kpis.totalEmployees) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card
        title="Total Workforce"
        value={kpis.totalEmployees}
        subtitle="Monitored Users"
        icon={Users}
        percentage={100}
        color={{
          bg: "bg-indigo-50/50",
          text: "text-indigo-600",
        }}
      />

      <Card
        title="Active"
        value={kpis.activeEmployees}
        subtitle="Currently Engaged"
        icon={Activity}
        percentage={activeRate}
        color={{
          bg: "bg-emerald-50/50",
          text: "text-emerald-600",
        }}
      />

      <Card
        title="Idle"
        value={kpis.idleEmployees}
        subtitle="Inactivity Detected"
        icon={Moon}
        percentage={idleRate}
        color={{
          bg: "bg-amber-50/50",
          text: "text-amber-600",
        }}
      />

      <Card
        title="Offline"
        value={kpis.offlineEmployees}
        subtitle="System Disconnected"
        icon={WifiOff}
        percentage={offlineRate}
        color={{
          bg: "bg-rose-50/50",
          text: "text-rose-600",
        }}
      />
    </div>
  );
}